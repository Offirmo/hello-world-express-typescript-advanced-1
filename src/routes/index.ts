import * as express from 'express'
import { ServerLogger, serverLoggerToConsole } from '@offirmo/loggers-types-and-stubs'

import { factory as createSplashApp } from '../apps/splash'


interface InjectableDependencies {
	logger: ServerLogger
}

const defaultDependencies: InjectableDependencies = {
	logger: serverLoggerToConsole,
}

async function create(dependencies: Partial<InjectableDependencies> = {}) {
	const { logger } = Object.assign({}, defaultDependencies, dependencies)
	logger.debug('Hello from main route!')

	const router = express.Router()

	router.use('/splash', await createSplashApp({
		logger,
	}))

	return router
}

export {
	InjectableDependencies,
	create,
}
