import { Response } from 'express'

enum HttpStatus {
	OK = 200,
	CREATED = 201,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	DUPLICATE_ENTRY = 409,
	INTERNAL_SERVER_ERROR = 500,
}

//! Success Responses
const Ok = (res: Response, message: string, data?: any) => {
	res.status(HttpStatus.OK).json({ status: HttpStatus.OK, message, data: data ?? [] })
}

const Created = (res: Response, message: string, data?: any) => {
	res.status(HttpStatus.CREATED).json({ status: HttpStatus.CREATED, message, data })
}

const NoContent = (res: Response) => {
	res.status(HttpStatus.NO_CONTENT).send()
}

//! Error Responses
const BadRequest = (res: Response, message: string, errors?: any) => {
	res.status(HttpStatus.BAD_REQUEST).json({ status: HttpStatus.BAD_REQUEST, message, ...(errors && { errors }) })
}

const Unauthorized = (res: Response, message: string = 'Unauthorized') => {
	res.status(HttpStatus.UNAUTHORIZED).json({ status: HttpStatus.UNAUTHORIZED, message })
}

const Forbidden = (res: Response, message: string = 'Forbidden') => {
	res.status(HttpStatus.FORBIDDEN).json({ status: HttpStatus.FORBIDDEN, message })
}

const NotFound = (res: Response, message: string = 'Resource not found') => {
	res.status(HttpStatus.NOT_FOUND).json({ status: HttpStatus.NOT_FOUND, message })
}

const DuplicateEntry = (res: Response, message: string = 'Duplicate entry') => {
	res.status(HttpStatus.DUPLICATE_ENTRY).json({ status: HttpStatus.DUPLICATE_ENTRY, message })
}

const Error = (res: Response, message: string = 'Internal server error') => {
	res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: HttpStatus.INTERNAL_SERVER_ERROR, message })
}

export const HttpResponse = {
	Ok,
	Created,
	NoContent,
	BadRequest,
	Unauthorized,
	Forbidden,
	NotFound,
	DuplicateEntry,
	Error,
}
