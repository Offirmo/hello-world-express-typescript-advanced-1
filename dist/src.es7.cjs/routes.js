"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const loggers_types_and_stubs_1 = require("@offirmo/loggers-types-and-stubs");
const health_check_1 = require("./apis/health-check");
const micro_page_1 = require("./services/micro-page");
const dev_endpoints_1 = require("./apis/dev/dev-endpoints");
const default_dependencies = {
    logger: loggers_types_and_stubs_1.serverLoggerToConsole,
    env: 'development',
};
function create(dependencies = {}) {
    const { env } = Object.assign({}, default_dependencies, dependencies);
    const router = express.Router();
    router.get('/', micro_page_1.serve_micro_page('TypeScript REST API demo', `
		<p>Sorry, this server is for computers only.</p>
		<p>Try those urls:</p>
		<li><a>/health-check</a>
		<li><a>/dev</a>
		<li><a>/non-existing-to-test-404</a>
	`));
    router.use('/health-check', health_check_1.health_check);
    if (env === 'development') {
        router.use('/dev', dev_endpoints_1.create());
    }
    return router;
}
exports.create = create;
//# sourceMappingURL=routes.js.map