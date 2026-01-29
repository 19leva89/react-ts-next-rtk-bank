import { prisma } from '@repo/bank-db'
import { JwtPayload, verify } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'


const auth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]
		if (!token) {
			// Handle the case when token is undefined
			return res.status(401).json({ msg: `Будь ласка, увійдіть, щоб продовжити` })
		}

		if (!process.env.JWT_SECRET) {
			// Handle the case when JWT_SECRET is undefined
			return res.status(500).json({ msg: `JWT_SECRET is not defined` })
		}
		const decoded = verify(token, process.env.JWT_SECRET) as JwtPayload

		const user = await prisma.user.findUnique({
			where: {
				id: decoded.id,
			},
		})

		req.user = user

		next()
	} catch (error) {
		console.error(error)
		res.status(401).json({ msg: `Будь ласка, увійдіть, щоб продовжити` })
	}
}

export { auth }
