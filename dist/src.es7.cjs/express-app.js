"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const express = require("express");
const uuid = require("uuid");
const body_parser_1 = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const loggers_types_and_stubs_1 = require("@offirmo/loggers-types-and-stubs");
const routes_1 = require("./routes");
const defaultDependencies = {
    logger: loggers_types_and_stubs_1.serverLoggerToConsole,
};
function create(dependencies = {}) {
    const { logger } = Object.assign({}, defaultDependencies, dependencies);
    logger.debug('Starting up: Initializing the top express app…');
    const app = express();
    // https://expressjs.com/en/4x/api.html#app.settings.table
    app.enable('trust proxy');
    app.disable('x-powered-by');
    app.use(function assign_unique_request_id(req, res, next) {
        req.uuid = uuid.v4();
        next();
    });
    // log the request as early as possible
    app.use(function log_request(req, res, next) {
        logger.info({
            uuid: req.uuid,
            method: morgan.method(req),
            url: morgan.url(req),
        });
        next();
    });
    // TODO activate CORS
    app.use(helmet());
    app.use(body_parser_1.urlencoded({
        extended: false,
        parameterLimit: 100,
        limit: '1Mb',
    }));
    app.use(routes_1.create({
        logger,
    }));
    // XXX is this needed ?
    app.use((req, res) => {
        logger.warn(`404 on "${req.path}"!"`);
        const status = 404;
        res
            .status(status)
            .type('txt')
            .send(`${status}: ${http.STATUS_CODES[status]}`);
    });
    /**
     *  Error-handling middleware always takes four arguments.
     *  You must provide four arguments to identify it as an error-handling middleware function.
     *  Even if you don’t need to use the next object, you must specify it to maintain the signature.
     *  Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.
     */
    app.use(function errorHandler(err, req, res, next) {
        if (!err) {
            err = new Error('unknown error');
        }
        logger.error({ err }, 'app error handler: request failed!');
        const status = err.httpStatusHint || 500;
        res
            .status(status)
            .type('txt')
            .send(`Something broke! Our devs are already on it! [${status}: ${http.STATUS_CODES[status]}]`);
    });
    return app;
}
exports.create = create;
//# sourceMappingURL=express-app.js.map