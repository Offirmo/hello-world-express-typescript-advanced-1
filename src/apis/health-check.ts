import express = require('express')

function health_check(req: express.Request, res: express.Response): void {
	res.header('Content-Type', 'text/plain;charset=UTF-8')
	res.status(200).send('OK')
}

export {
	health_check,
}
