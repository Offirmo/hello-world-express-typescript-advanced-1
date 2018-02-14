"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function health_check(req, res) {
    res.header('Content-Type', 'text/plain;charset=UTF-8');
    res.status(200).send('OK');
}
exports.health_check = health_check;
//# sourceMappingURL=health-check.js.map