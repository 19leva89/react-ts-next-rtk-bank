import express, { Router } from 'express'

import {
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
} from '../controllers/users'
import { auth } from '../middleware/auth'

const router: Router = express.Router()

// /api/user/login
router.post('/login', login)

// /api/user/register
router.post('/register', register)

// /api/user/register-confirm
router.post('/register-confirm', registerConfirm)

// /api/user/recovery
router.post('/recovery', recovery)

// /api/user/recovery-confirm
router.post('/recovery-confirm', recoveryConfirm)

//api/user/new-email
router.put('/new-email', auth, newEmail)

// /api/user/new-password
router.put('/new-password', auth, newPassword)

// /api/user/send
router.post('/send', auth, sendPayment)

// /api/user/receive
router.post('/receive', auth, receivePayment)

// /api/user/current
router.get('/current', auth, current)

export default router
