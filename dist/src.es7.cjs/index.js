"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const bunyan = require("bunyan");
const express_app_1 = require("./express-app");
async function create() {
    console.log('Starting...'); // tslint:disable-line
    // TODO plug to a syslog
    const logger = bunyan.createLogger({
        name: 'ServerX',
        level: 'debug',
        serializers: bunyan.stdSerializers,
    });
    logger.info('Starting up: Logger ready.');
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
    logger.debug('Starting up: Now listening to uncaughts and warnings.');
    const config = {
        port: process.env.PORT || 5000,
        env: process.env.NODE_ENV || 'development',
    };
    const server = http_1.createServer(express_app_1.create({
        logger,
    }));
    logger.info(`Starting up: env = ${config.env}`);
    server.listen(config.port, (err) => {
        if (err) {
            logger.fatal(err, 'Server error!');
            return;
        }
        logger.info(`Starting up: Server launched, listening on :${config.port}`);
    });
    // https://extranet.atlassian.com/pages/viewpage.action?pageId=3664314741
    server.on('clientError', (error, socket) => {
        logger.error(`Received invalid request. Error code ${error.code}`);
        socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n');
    });
    server.on('close', () => {
        logger.info('server close event');
    });
}
create()
    .catch(e => {
    console.error('Server failed to launch:', e.message); // tslint:disable-line
});
//# sourceMappingURL=index.js.map