import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { prisma } from '@repo/bank-db'
import { Request, Response } from 'express'



/**
 * @route POST /api/user/login
 * @desc Login
 * @access Public
 */
const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body
		if (!email || !password) {
			return res.status(400).json({ msg: `Будь ласка, заповніть обов'язкові поля` })
		}

		const user = await prisma.user.findFirst({
			where: {
				email: email.toLowerCase(),
			},
		})

		if (!user) {
			return res.status(404).json({ msg: `Користувача не знайдено` })
		}

		const isPasswordCorrect = user && (await bcrypt.compare(password, user.password))
		const secret = process.env.JWT_SECRET

		if (user && isPasswordCorrect && secret) {
			// Create login notification
			const notification = await prisma.notification.create({
				data: {
					eventTitle: 'login',
					eventTime: new Date(),
					eventType: 'Warning',
					userId: user.id,
					
				},
			})

			if (notification) {
				return res.status(200).json({
					id: user.id,
					email: user.email,
					name: user.name,
					token: jwt.sign({ id: user.id }, secret, { expiresIn: '1d' }),
				})
			} else {
				return res.status(500).json({ msg: `Не вдалося створити нотифікацію` })
			}
		} else {
			return res.status(401).json({ msg: `Логін або пароль введено невірно` })
		}
	} catch (error) {
		console.error(error)
		res.status(500).json({ msg: `Щось пішло не так` })
	}
}

/**
 * @route POST /api/user/register
 * @desc Register
 * @access Public
 */
const register = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body
		if (!email || !password) {
			return res.status(400).json({ msg: `Будь ласка, заповніть обов'язкові поля` })
		}

		const registeredUser = await prisma.user.findFirst({
			where: {
				email: email.toLowerCase(),
			},
		})

		if (registeredUser) {
			return res.status(400).json({ msg: `Користувач з такою електронною адресою вже існує` })
		}

		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		const user = await prisma.user.create({
			data: {
				email: email.toLowerCase(),
				password: hashedPassword,
				isConfirmed: false,
			},
		})

		const secret = process.env.JWT_SECRET

		// Generate and store a confirmation code
		const confirmCode = crypto.randomInt(100000, 999999).toString()

		// Save the confirmation code to the database
		await prisma.confirmCode.create({
			data: {
				userId: user.id,
				code: confirmCode,
				expiresAt: new Date(Date.now() + 360 * 60 * 1000), // 6h
			},
		})

		// Send the confirmation code via email of sms
		console.log('Email confirm code:', confirmCode)

		if (user && secret && confirmCode) {
			return res.status(201).json({
				id: user.id,
				email: user.email,
				token: jwt.sign({ id: user.id }, secret, { expiresIn: '1d' }),
			})
		} else {
			return res.status(400).json({ msg: `Не вдалося створити користувача` })
		}
	} catch (error) {
		console.error(error)
		res.status(500).json({ msg: `Щось пішло не так` })
	}
}

/**
 * @route POST /api/user/register-confirm
 * @desc Confirm email
 * @access Public
 */
const registerConfirm = async (req: Request, res: Response) => {
	try {
		const { code } = req.body
		if (!code) {
			return res.status(400).json({ msg: `Будь ласка, заповніть обов'язкові поля` })
		}

		// Get the confirmation code from the database
		const savedCodeRecord = await prisma.confirmCode.findFirst({
			where: {
				code: code,
				expiresAt: {
					gte: new Date(), // Check if the code is still valid
				},
			},
		})

		if (!savedCodeRecord) {
			return res.status(400).json({ msg: `Невірний код підтвердження пошти або термін його дії закінчився` })
		}

		// Update the user's isConfirmed field
		await prisma.user.update({
			where: { id: savedCodeRecord.userId },
			data: { isConfirmed: true },
		})

		// Delete the confirmation code
		await prisma.confirmCode.delete({
			where: {
				id: savedCodeRecord.id,
			},
		})

		return res.status(200).json({ msg: `Пошту успішно підтверджено` })
	} catch (error) {
		console.error(error)
		res.status(500).json({ msg: `Щось пішло не так` })
	}
}

/**
 * @route POST /api/user/recovery
 * @desc Recovery password
 * @access Public
 */
const recovery = async (req: Request, res: Response) => {
	try {
		const { email } = req.body
		if (!email) {
			return res.status(400).json({ msg: `Будь ласка, заповніть обов'язкові поля` })
		}

		const user = await prisma.user.findFirst({
			where: {
				email: email.toLowerCase(),
			},
		})

		if (!user) {
			return res.status(400).json({ msg: `Користувача з такою електронною адресою не існує` })
		}

		// Generate and store a recovery code
		const recoveryCode = crypto.randomInt(100000, 999999).toString()

		// Save the recovery code to the database
		await prisma.recoveryCode.create({
			data: {
				userId: user.id,
				code: recoveryCode,
				expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30m
			},
		})

		// Send the recovery code via email of sms
		console.log('Change password confirm code:', recoveryCode)

		// Create notification
		const notification = await prisma.notification.create({
			data: {
				eventTitle: 'recovery',
				eventTime: new Date(),
				eventType: 'Warning',
				userId: user.id,
			},
		})

		if (notification) {
			return res.status(201).json({ msg: `Код для відновлення паролю відправлено у консоль` })
		} else {
			return res.status(500).json({ msg: `Не вдалося створити нотифікацію` })
		}
	} catch (error) {
		console.error(error)
		res.status(500).json({ msg: `Щось пішло не так` })
	}
}

/**
 * @route POST /api/user/recovery-confirm
 * @desc Confirm recovery password
 * @access Public
 */
const recoveryConfirm = async (req: Request, res: Response) => {
	try {
		const { code, newPassword } = req.body

		if (!code || !newPassword) {
			return res.status(400).json({ msg: `Будь ласка, заповніть обов'язкові поля` })
		}

		// Get the recovery code from the database
		const savedCodeRecord = await prisma.recoveryCode.findFirst({
			where: {
				code: code,
				expiresAt: {
					gte: new Date(), // Check if the code is still valid
				},
			},
		})

		if (!savedCodeRecord) {
			return res.status(400).json({ msg: `Невірний код відновлення паролю або термін його дії закінчився` })
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(newPassword, 10)

		// Update the user's password
		await prisma.user.update({
			where: { id: savedCodeRecord.userId },
			data: { password: hashedPassword },
		})

		// Delete the recovery code
		await prisma.recoveryCode.delete({
			where: {
				id: savedCodeRecord.id,
			},
		})

		return res.status(200).json({ msg: `Пароль успішно оновлено` })
	} catch (error) {
		console.error(error)
		res.status(500).json({ msg: `Щось пішло не так` })
	}
}

/**
 * @route PUT /api/user/new-email
 * @desc Change email
 * @access Private
 */
const newEmail = async (req: Request, res: Response) => {
	try {
		const { newEmail, password } = req.body
		if (!newEmail || !password) {
			return res.status(400).json({ msg: `Будь ласка, заповніть обов'язкові поля` })
		}

		const user = await prisma.user.findFirst({
			where: {
				id: req.user.id,
			},
		})
		if (!user) {
			return res.status(404).json({ msg: `Користувача не знайдено` })
		}

		if (user.email.toLowerCase() === newEmail.toLowerCase()) {
			return res.status(400).json({ msg: `Новий email повинен відрізнятися від старого` })
		}

		const existingUserWithNewEmail = await prisma.user.findFirst({
			where: {
				email: newEmail.toLowerCase(),
				id: {
					not: req.user.id,
				},
			},
		})
		if (existingUserWithNewEmail) {
			return res.status(400).json({ msg: `Користувач з такою електронною адресою вже існує` })
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password)
		if (!isPasswordCorrect) {
			return res.status(400).json({ msg: `Пароль неправильний` })
		}

		await prisma.user.update({
			where: { id: req.user.id },
			data: { email: newEmail.toLowerCase() },
		})

		// Create login notification
		const notification = await prisma.notification.create({
			data: {
				eventTitle: 'email',
				eventTime: new Date(),
				eventType: 'Warning',
				userId: user.id,
			},
		})

		if (notification) {
			return res.status(200).json({ msg: `Пошту успішно оновлено` })
		} else {
			return res.status(500).json({ msg: `Не вдалося створити нотифікацію` })
		}
	} catch (error) {
		console.error(error)
		res.status(500).json({ msg: `Щось пішло не так` })
	}
}

/**
 * @route PUT /api/user/new-password
 * @desc Change password
 * @access Private
 */
const newPassword = async (req: Request, res: Response) => {
	try {
		const { oldPassword, newPassword } = req.body
		if (!oldPassword || !newPassword) {
			return res.status(400).json({ msg: `Будь ласка, заповніть обов'язкові поля` })
		}

		const user = await prisma.user.findFirst({ where: { id: req.user.id } })
		if (!user) {
			return res.status(404).json({ msg: `Користувача не знайдено` })
		}

		const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password)
		if (!isPasswordCorrect) {
			return res.status(400).json({ msg: `Старий пароль неправильний` })
		}

		if (oldPassword === newPassword) {
			return res.status(400).json({ msg: `Новий пароль повинен відрізнятися від старого` })
		}

		const salt = await bcrypt.genSalt(10)
		const hashedNewPassword = await bcrypt.hash(newPassword, salt)

		await prisma.user.update({
			where: { id: req.user.id },
			data: { password: hashedNewPassword },
		})

		// Create notification for password change
		const notification = await prisma.notification.create({
			data: {
				eventTitle: 'password',
				eventTime: new Date(),
				eventType: 'Warning',
				userId: user.id,
			},
		})

		if (notification) {
			return res.status(200).json({ msg: `Пароль успішно оновлено` })
		} else {
			return res.status(500).json({ msg: `Не вдалося створити нотифікацію` })
		}
	} catch (error) {
		console.error(error)
		res.status(500).json({ msg: `Щось пішло не так` })
	}
}

/**
 * @route POST /api/user/send
 * @desc Send payment
 * @access Private
 */
const sendPayment = async (req: Request, res: Response) => {
	try {
		const { email, amount } = req.body
		if (!email || !amount) {
			return res.status(400).json({ msg: `Будь ласка, заповніть обов'язкові поля` })
		}

		const parsedAmount = parseFloat(amount as string) // Assuming amount is string from body

		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			return res.status(400).json({ msg: `Невірна сума` })
		}

		if (!req.user?.email || !req.user?.id) {
			return res.status(401).json({ msg: `Користувач не авторизований` })
		}

		if (req.user.email === email) {
			return res.status(400).json({ msg: `Неможливо відправити кошти самому собі` })
		}

		// Fetch recipient before transaction
		const recipient = await prisma.user.findUnique({
			where: { email },
		})

		if (!recipient) {
			return res.status(400).json({ msg: `Отримувача не знайдено` })
		}

		// Check balance (assuming req.user.balance exists and is a number)
		if (!req.user.balance || req.user.balance < parsedAmount) {
			return res.status(400).json({ msg: `Недостатній баланс` })
		}

		// Perform atomic transaction
		await prisma.$transaction(async (prismaClient) => {
			// Update sender balance
			await prismaClient.user.update({
				where: { id: req.user.id },
				data: { balance: { decrement: parsedAmount } },
			})

			// Update recipient balance
			await prismaClient.user.update({
				where: { id: recipient.id },
				data: { balance: { increment: parsedAmount } },
			})

			// Create transaction for sender (status "Send")
			await prismaClient.transaction.create({
				data: {
					paymentSystem: req.user.email, // or adjust as needed
					amount: parsedAmount,
					status: 'Send',
					userId: req.user.id,
				},
			})

			// Create transaction for recipient (status "Receive")
			await prismaClient.transaction.create({
				data: {
					paymentSystem: email,
					amount: parsedAmount,
					status: 'Receive',
					userId: recipient.id,
				},
			})

			// Create notification for sender
			await prismaClient.notification.create({
				data: {
					eventTitle: 'send',
					eventTime: new Date(),
					eventType: 'Announcement',
					userId: req.user.id,
				},
			})

			// Create notification for recipient
			await prismaClient.notification.create({
				data: {
					eventTitle: 'receive',
					eventTime: new Date(),
					eventType: 'Announcement',
					userId: recipient.id,
				},
			})
		})

		// Refetch updated sender to include new balance
		const updatedSender = await prisma.user.findUnique({
			where: { id: req.user.id },
		})

		// TS knows updatedSender is User | null, but since id exists, it's safe; add ! if confident
		if (!updatedSender) {
			return res.status(500).json({ msg: `Помилка оновлення даних` })
		}

		res.status(200).json({ sender: updatedSender, msg: `Платіж успішно відправлено` })
	} catch (error) {
		console.error(error)
		// Handle Prisma errors or others more specifically if needed
		res.status(500).json({ msg: `Щось пішло не так` })
	}
}

/**
 * @route POST /api/user/receive
 * @desc Receive payment
 * @access Private
 */
const receivePayment = async (req: Request, res: Response) => {
	try {
		const { amount, paymentSystem } = req.body
		if (!amount || !paymentSystem) {
			return res.status(400).json({ msg: `Будь ласка, заповніть обов'язкові поля` })
		}

		const parsedAmount = parseFloat(amount as string) // Assuming amount is string from body

		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			return res.status(400).json({ msg: `Невірна сума` })
		}

		if (!req.user?.id) {
			return res.status(401).json({ msg: `Користувач не авторизований` })
		}

		// Perform atomic transaction (though simpler here, still good for consistency)
		await prisma.$transaction(async (prismaClient) => {
			// Update recipient balance
			await prismaClient.user.update({
				where: { id: req.user.id },
				data: { balance: { increment: parsedAmount } },
			})

			// Create transaction for recipient (status "Receive")
			await prismaClient.transaction.create({
				data: {
					paymentSystem,
					amount: parsedAmount,
					status: 'Receive',
					userId: req.user.id,
				},
			})

			// Create notification for recipient
			await prismaClient.notification.create({
				data: {
					eventTitle: 'receive',
					eventTime: new Date(),
					eventType: 'Announcement',
					userId: req.user.id,
				},
			})
		})

		// Refetch updated recipient to include new balance
		const updatedRecipient = await prisma.user.findUnique({
			where: { id: req.user.id },
		})

		// TS knows updatedRecipient is User | null, but since id exists, it's safe; add ! if confident
		if (!updatedRecipient) {
			return res.status(500).json({ msg: `Помилка оновлення даних` })
		}

		res.status(200).json({ recipient: updatedRecipient, msg: `Рахунок успішно поповнено` })
	} catch (error) {
		console.error(error)
		// Handle Prisma errors or others more specifically if needed
		res.status(500).json({ msg: `Щось пішло не так` })
	}
}

/**
 * @route GET /api/user/current
 * @desc Get current user
 * @access Private
 */
const current = async (req: Request, res: Response) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email: req.user.email,
			},
			include: {
				notifications: true,
				transactions: true,
			},
		})

		if (!user) {
			return res.status(404).json({ msg: 'Користувач не знайдений' })
		}

		return res.status(200).json(user)
	} catch (error) {
		console.error(error)
		res.status(500).json({ msg: `Щось пішло не так` })
	}
}

export {
	login,
	register,
	registerConfirm,
	recovery,
	recoveryConfirm,
	newEmail,
	newPassword,
	sendPayment,
	receivePayment,
	current,
}
