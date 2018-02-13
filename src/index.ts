import { createServer } from 'http'
import * as bunyan from 'bunyan'
import { ServerLogger } from '@offirmo/loggers-types-and-stubs'

import { create as createExpressApp } from './express-app'


async function create() {
	console.log('Starting_')

	// TODO plug to a syslog
	const logger: ServerLogger = bunyan.createLogger({
		name: 'ServerX',
		level: 'debug', // TODO fix
		serializers: bunyan.stdSerializers,
	})
	logger.info('Logger ready.')

	process.on('uncaughtException', (err: Error) => {
		console.error(`Uncaught exception!`, err)
		setTimeout(() => process.exit(1), 250)
		logger.fatal(err, `Uncaught exception!`)
		// TODO cleanup
		// I've an experimental module for that…
	})

	process.on('unhandledRejection', (reason: any, p: Promise<any>): void => {
		console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
		setTimeout(() => process.exit(1), 250)
		logger.fatal({ reason, p }, `Uncaught rejection!`)
		// TODO cleanup
		// I've an experimental module for that…
	})

	process.on('warning', (warning: Error) => {
		console.warn(warning)
		logger.warn(warning)
	})

	logger.debug('Now listening to uncaughts and warnings.')


	const config = {
		port: process.env.PORT || 5000,
		isHttps: (process.env.IS_HTTPS === 'true'),
	}

	const server = createServer(await createExpressApp({
		logger,
		isHttps: config.isHttps,
	}))

	server.listen(config.port, (err: Error) => {
		if (err) {
			console.error(`Server error!`, err)
			logger.fatal(err, `Server error!`)
			return
		}

		logger.info(`Server launched, listening on :${config.port}`)
	})

}

create()
.catch(e => {
	console.error('Server failed to launch:', e.message)
})
