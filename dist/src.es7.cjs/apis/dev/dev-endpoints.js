"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const micro_page_1 = require("../../services/micro-page");
function create() {
    const router = express.Router();
    router.get('/', micro_page_1.serve_micro_page('Dev routes', `
<li><a>/ping</a>
<li><a>/mock-status</a> (HTTP status code)
<li><a>/sync-error</a>
<li><a>/client-error-next</a>
<li><a>/runtime-error-next</a>
<li><a>/async-error</a>
<li><a>/timeout</a>
<li><a>/timeout/3</a> (duration in s)
<li><a>/anything_not_handled_will_just_echo</a>
	`));
    router.get('/ping', function (req, res) {
        res.send('pong');
    });
    // A endpoint which can mock a return status.
    router.get('/mock-status', function (req, res) {
        const status = Number.parseInt(req.params.status, 10) || 200;
        res.header('Content-Type', 'text/plain;charset=UTF-8');
        res.status(status).send(`Mocked ${status} at ${new Date().toISOString()}.`);
    });
    router.get('/client-error-next', function (req, res, next) {
        res
            .status(418)
            .send("I'm a teapot! (sent directly, error middlewares not used)");
    });
    router.get('/runtime-error-next', function (req, res, next) {
        const err = new Error('A test exception passed to next()  !');
        err.httpStatusHint = 567;
        next(err);
    });
    router.get('/sync-error', function () {
        throw new Error('A test exception thrown synchronously !');
    });
    // Should not happen but can (bug)
    // depending on your setup, it may crash the app
    router.get('/async-error', function () {
        setTimeout(function () {
            throw new Error('A test exception thrown asynchronously !');
        }, 0);
    });
    router.get('/timeout', function () {
        // do nothing and let a timeout happen (hopefully)...
    });
    router.get('/timeout/:durationInSec', function (req, res) {
        const timeout = Number(req.params.durationInSec);
        if (Number.isNaN(timeout)) {
            const err = new Error('You must provide a number in second !');
            err.httpStatusHint = 400;
            throw err;
        }
        else {
            setTimeout(function () {
                res.send('I waited ' + req.params.durationInSec + ' second(s).');
            }, timeout * 1000);
        }
    });
    router.get('*', function (req, res) {
        res.send('TODO echo');
    });
    return router;
}
exports.create = create;
//# sourceMappingURL=dev-endpoints.js.map