export type User = {
	id: string
	email: string
	password: string
	name?: string
	isConfirmed: boolean
	balance: number
	img: string
	confirmCodes: ConfirmCode[]
	recoveryCodes: RecoveryCode[]
	transactions: Transaction[]
	notifications: Notification[]
}

export type ConfirmCode = {
	id: string
	userId: string
	code: string
	expiresAt: Date
	user: User
}

export type RecoveryCode = {
	id: string
	userId: string
	code: string
	expiresAt: Date
	user: User
}

export type Transaction = {
	id: string
	paymentSystem: string
	amount: number
	status: string
	date: Date
	userId: string
	user: User
}

export type Notification = {
	id: string
	eventTitle: string
	eventTime: Date
	eventType: string
	userId: string
	user: User
}

export type ErrorWithMsg = {
	status: number
	data: {
		msg: string
	}
}
