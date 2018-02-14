"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const bunyan = require("bunyan");
const express_app_1 = require("./express-app");
async function create() {
    console.log('Starting_'); // tslint:disable-line
    // TODO plug to a syslog
    const logger = bunyan.createLogger({
        name: 'ServerX',
        level: 'debug',
        serializers: bunyan.stdSerializers,
    });
    logger.info('Logger ready.');
    process.on('uncaughtException', (err) => {
        logger.fatal(err, 'Uncaught exception!');
        // no need to crash the app, our server is stateless
    });
    process.on('unhandledRejection', (reason, p) => {
        logger.fatal({ reason, p }, 'Uncaught rejection!');
        // no need to crash the app, our server is stateless
    });
    process.on('warning', (warning) => {
        logger.warn(warning);
    });
    logger.debug('Now listening to uncaughts and warnings.');
    const config = {
        port: process.env.PORT || 5000,
        isHttps: (process.env.IS_HTTPS === 'true'),
    };
    const server = http_1.createServer(await express_app_1.create({
        logger,
        isHttps: config.isHttps,
    }));
    server.listen(config.port, (err) => {
        if (err) {
            logger.fatal(err, 'Server error!');
            return;
        }
        logger.info(`Server launched, listening on :${config.port}`);
    });
}
create()
    .catch(e => {
    console.error('Server failed to launch:', e.message); // tslint:disable-line
});
//# sourceMappingURL=index.js.map