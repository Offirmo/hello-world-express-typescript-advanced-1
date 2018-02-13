import * as express from 'express'
import * as uuid from 'uuid'
import { urlencoded as bodyUrlencodedParser} from 'body-parser'
import * as morgan from 'morgan'
import * as helmet from 'helmet'
import { ServerLogger, serverLoggerToConsole } from '@offirmo/loggers-types-and-stubs'

import { create as createRoutes } from './routes'
import { ExtendedError, RequestWithUUID } from './types'


interface InjectableDependencies {
	logger: ServerLogger
	sessionSecret: string
	isHttps: boolean
}

const defaultDependencies: InjectableDependencies = {
	logger: serverLoggerToConsole,
	sessionSecret: 'keyboard cat',
	isHttps: false,
}

async function create(dependencies: Partial<InjectableDependencies> = {}) {
	const { logger, isHttps } = Object.assign({}, defaultDependencies, dependencies)
	let { sessionSecret } = Object.assign({}, defaultDependencies, dependencies)
	logger.debug('Initializing the top express app…')

	if (!isHttps)
		logger.warn('XXX please activate HTTPS on this server !')

	sessionSecret = sessionSecret || defaultDependencies.sessionSecret
	if (sessionSecret === defaultDependencies.sessionSecret)
		logger.warn('XXX please set a secret for the session middleware !')

	const app = express()

	// https://expressjs.com/en/4x/api.html#app.settings.table
	app.enable('trust proxy')
	app.disable('x-powered-by')

	app.use(function assignId(untyped_req, res, next) {
		const req = untyped_req as RequestWithUUID
		req.uuid = uuid.v4()
		next()
	})

	// log the request as early as possible
	app.use(function log(untyped_req, res, next) {
		const req = untyped_req as RequestWithUUID

		logger.info({
			uuid: req.uuid,
			method: (morgan as any)['method'](req),
			url: (morgan as any)['url'](req),
		})
		next()
	})

	// TODO activate CORS
	app.use(helmet())

	app.use(bodyUrlencodedParser({
		extended: false,
		parameterLimit: 100, // less than the default
		limit: '1Mb', // for profile image
	}))

	app.use(await createRoutes({
		logger,
	}))

	app.use((req, res) => {
		logger.error(`! 404 on "${req.path}" !"`)
		res.status(404).end()
	})

	const errorHandler: express.ErrorRequestHandler = (err: ExtendedError, req, res, next) => {
		logger.error(err)
		res.status(err.httpStatusHint || 500).send(`Something broke! Our devs are already on it!`)
	}
	app.use(errorHandler)

	return app
}

export {
	InjectableDependencies,
	create,
}
