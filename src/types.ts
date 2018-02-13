import * as Express from 'express'


interface ExtendedError extends Error {
	httpStatusHint: number
	details?: any // TODO JSON
}

interface RequestWithUUID extends Express.Request {
	uuid: string // module uuid
}

interface RequestWithParsedBody extends Express.Request {
	body: any // body parser TODO use JSON type
}

interface ExtendedRequest extends RequestWithUUID, RequestWithParsedBody {
}

export {
	ExtendedError,
	RequestWithUUID,
	RequestWithParsedBody,
	ExtendedRequest,
}
