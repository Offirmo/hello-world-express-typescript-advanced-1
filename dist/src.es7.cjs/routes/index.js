"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const loggers_types_and_stubs_1 = require("@offirmo/loggers-types-and-stubs");
const splash_1 = require("../apps/splash");
const defaultDependencies = {
    logger: loggers_types_and_stubs_1.serverLoggerToConsole,
};
async function create(dependencies = {}) {
    const { logger } = Object.assign({}, defaultDependencies, dependencies);
    logger.debug('Hello from main route!');
    const router = express.Router();
    router.use('/splash', await splash_1.factory({
        logger,
    }));
    return router;
}
exports.create = create;
//# sourceMappingURL=index.js.map