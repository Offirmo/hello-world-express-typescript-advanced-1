import * as express from 'express'
import { ServerLogger, serverLoggerToConsole } from '@offirmo/loggers-types-and-stubs'

import { health_check } from '../apis/health-check'
import { factory as createSplashApp } from '../apps/splash'
import { serve_micro_page } from '../middlewares/micro-page'

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

	router.get('/', serve_micro_page('hello', `
		<p>Sorry, this server is for computers only.</p>
		<a>/health-check</a>
	`))

	router.use('/health-check', health_check)

	router.use('/splash', await createSplashApp({
		logger,
	}))

	return router
}

export {
	InjectableDependencies,
	create,
}
