export const BASE_URL =
	process.env.NODE_ENV === 'production'
		? 'https://react-ts-rtk-bank-server.onrender.com'
		: 'http://localhost:4000'

export const REG_EXP_EMAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
export const REG_EXP_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/
export const REG_EXP_AMOUNT = /^(?!0+(\.0+)?$)\d+(\.\d{1,2})?$/
export const REG_EXP_CODE = /^\d{6}$/
