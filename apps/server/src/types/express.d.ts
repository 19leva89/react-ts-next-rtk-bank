import { Request } from 'express'

declare global {
	namespace Express {
		interface Request {
			user?: User // Optional, since it might not exist pre-auth
		}
	}
}
