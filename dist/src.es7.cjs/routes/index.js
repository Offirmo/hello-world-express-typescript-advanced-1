"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const loggers_types_and_stubs_1 = require("@offirmo/loggers-types-and-stubs");
const health_check_1 = require("../apis/health-check");
const splash_1 = require("../apps/splash");
const micro_page_1 = require("../middlewares/micro-page");
const defaultDependencies = {
    logger: loggers_types_and_stubs_1.serverLoggerToConsole,
};
async function create(dependencies = {}) {
    const { logger } = Object.assign({}, defaultDependencies, dependencies);
    logger.debug('Hello from main route!');
    const router = express.Router();
    router.get('/', micro_page_1.serve_micro_page('hello', `
		<p>Sorry, this server is for computers only.</p>
		<a>/health-check</a>
	`));
    router.use('/health-check', health_check_1.health_check);
    router.use('/splash', await splash_1.factory({
        logger,
    }));
    return router;
}
exports.create = create;
//# sourceMappingURL=index.js.map