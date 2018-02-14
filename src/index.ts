import { createServer } from 'http'
import * as bunyan from 'bunyan'
import { ServerLogger } from '@offirmo/loggers-types-and-stubs'


import { create as createExpressApp } from './express-app'


async function create() {
	console.log('Starting...') // tslint:disable-line

	// TODO plug to a syslog
	const logger: ServerLogger = bunyan.createLogger({
		name: 'ServerX',
		level: 'debug', // TODO fix
		serializers: bunyan.stdSerializers,
	})
	logger.info('Starting up: Logger ready.')


	process.on('uncaughtException', (err: Error): void => {
		logger.fatal(err, 'Uncaught exception!')
		// no need to crash the app, our server is stateless
	})

	process.on('unhandledRejection', (reason: any, p: Promise<any>): void => {
		logger.fatal({ reason, p }, 'Uncaught rejection!')
		// no need to crash the app, our server is stateless
	})

	process.on('warning', (warning: Error): void => {
		logger.warn(warning)
	})

	logger.debug('Starting up: Now listening to uncaughts and warnings.')


	const config = {
		port: process.env.PORT || 5000,
		env: process.env.NODE_ENV || 'development',
	}

	const server = createServer(createExpressApp({
		logger,
	}))
	logger.info(`Starting up: env = ${config.env}`)

	server.listen(config.port, (err: Error) => {
		if (err) {
			logger.fatal(err, 'Server error!')
			return
		}

		logger.info(`Starting up: Server launched, listening on :${config.port}`)
	})

	// https://extranet.atlassian.com/pages/viewpage.action?pageId=3664314741
	server.on('clientError', (error, socket) => {
		logger.error(`Received invalid request. Error code ${error.code}`)
		socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n')
	})

	server.on('close', () => {
		logger.info('server close event')
	})


}

create()
.catch(e => {
	console.error('Server failed to launch:', e.message) // tslint:disable-line
})
