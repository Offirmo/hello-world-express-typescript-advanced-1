import http = require('http')
import express = require('express')
import uuid = require('uuid')
import { urlencoded as bodyUrlencodedParser} from 'body-parser'
import morgan = require('morgan')
import helmet = require('helmet')
import { ServerLogger, serverLoggerToConsole } from '@offirmo/loggers-types-and-stubs'

import { create as createRoutes } from './routes'
import { ExtendedError, RequestWithUUID } from './types'


interface InjectableDependencies {
	logger: ServerLogger
	isHttps: boolean
}

const defaultDependencies: InjectableDependencies = {
	logger: serverLoggerToConsole,
	isHttps: false,
}

async function create(dependencies: Partial<InjectableDependencies> = {}) {
	const { logger, isHttps } = Object.assign({}, defaultDependencies, dependencies)
	logger.debug('Initializing the top express app…')

	if (!isHttps)
		logger.warn('XXX please activate HTTPS on this server !')

	const app = express()

	// https://expressjs.com/en/4x/api.html#app.settings.table
	app.enable('trust proxy')
	app.disable('x-powered-by')

	app.use(function assign_unique_request_id(req, res, next) {
		(req as RequestWithUUID).uuid = uuid.v4()
		next()
	})

	// log the request as early as possible
	app.use(function log_request(req, res, next) {
		logger.info({
			uuid: (req as RequestWithUUID).uuid,
			method: (morgan as any).method(req),
			url: (morgan as any).url(req),
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

	/**
	 *  Error-handling middleware always takes four arguments.
	 *  You must provide four arguments to identify it as an error-handling middleware function.
	 *  Even if you don’t need to use the next object, you must specify it to maintain the signature.
	 *  Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.
	 */
	app.use(function errorHandler(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
		if (!err) {err = new Error('unknown error')}
		logger.error({err}, 'app error handler: request failed!')
		const status = (err as ExtendedError).httpStatusHint || 500
		res.status(status).send(`Something broke! Our devs are already on it! [${status}: ${http.STATUS_CODES[status]}]`)
	})

	return app
}

export {
	InjectableDependencies,
	create,
}
