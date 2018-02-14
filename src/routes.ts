import * as express from 'express'
import { ServerLogger, serverLoggerToConsole } from '@offirmo/loggers-types-and-stubs'

import { health_check } from './apis/health-check'
import { serve_micro_page } from './services/micro-page'
import { create as create_dev_endpoints } from './apis/dev/dev-endpoints'

interface InjectableDependencies {
	logger: ServerLogger
	env: string
}

const default_dependencies: InjectableDependencies = {
	logger: serverLoggerToConsole,
	env: 'development',
}

function create(dependencies: Partial<InjectableDependencies> = {}): express.Router {
	const { env } = Object.assign({}, default_dependencies, dependencies)

	const router = express.Router()

	router.get('/', serve_micro_page('TypeScript REST API demo', `
		<p>Sorry, this server is for computers only.</p>
		<p>Try those urls:</p>
		<li><a>/health-check</a>
		<li><a>/dev</a>
		<li><a>/non-existing-to-test-404</a>
	`))

	router.use('/health-check', health_check)

	if (env === 'development') {
		router.use('/dev', create_dev_endpoints())
	}

	return router
}

export {
	InjectableDependencies,
	create,
}
