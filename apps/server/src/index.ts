import cors from 'cors'
import dotenv from 'dotenv'
import logger from 'morgan'
import express from 'express'
import cookieParser from 'cookie-parser'
import type { Express, NextFunction, Request, Response } from 'express'

import usersRouter from './routes/users'

interface AppError extends Error {
	status?: number
}

const app: Express = express()

dotenv.config()

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.get('/health', (_req: Request, res: Response) => {
	return res.status(200).json({
		status: 'ok',
		uptime: process.uptime(),
		timestamp: Date.now(),
	})
})

app.use('/api/user', usersRouter)

app.use((error: AppError, _req: Request, res: Response, _next: NextFunction) => {
	console.log(error)

	return res.status(error.status || 500).json({ message: error.message || 'Inter Server Error!' })
})

if (process.env.NODE_ENV !== 'production') {
	// For dev/local only: starting the server
	const startServer = async () => {
		const port = 8000

		app.listen(port, () => {
			console.log(`Product service is running on port ${port}`)
		})
	}

	startServer()
}

// Export for Vercel/serverless
export default app
