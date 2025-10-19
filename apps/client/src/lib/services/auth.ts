import { User } from '@/lib/types'
import { api } from '@/lib/services/api'

export type UserData = Omit<User, 'id'>
export type RegisterData = Omit<User, 'id'> & {
	confirmPassword: string
}
type ResponseData = User & { token: string; msg: string }

export const authApi = api.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation<ResponseData, UserData>({
			query: (userData) => ({
				url: '/user/login',
				method: 'POST',
				body: userData,
			}),
		}),

		register: builder.mutation<ResponseData, UserData>({
			query: (userData) => ({
				url: '/user/register',
				method: 'POST',
				body: userData,
			}),
		}),

		registerConfirm: builder.mutation<ResponseData, UserData>({
			query: (userData) => ({
				url: '/user/register-confirm',
				method: 'POST',
				body: userData,
			}),
		}),

		recovery: builder.mutation<ResponseData, UserData>({
			query: (userData) => ({
				url: '/user/recovery',
				method: 'POST',
				body: userData,
			}),
		}),

		recoveryConfirm: builder.mutation<ResponseData, UserData>({
			query: (userData) => ({
				url: '/user/recovery-confirm',
				method: 'POST',
				body: userData,
			}),
		}),

		newEmail: builder.mutation<ResponseData, UserData>({
			query: (userData) => ({
				url: '/user/new-email',
				method: 'PUT',
				body: userData,
			}),
		}),

		newPassword: builder.mutation<ResponseData, UserData>({
			query: (userData) => ({
				url: '/user/new-password',
				method: 'PUT',
				body: userData,
			}),
		}),

		sendPayment: builder.mutation<ResponseData, UserData>({
			query: (userData) => ({
				url: '/user/send',
				method: 'POST',
				body: userData,
			}),
		}),

		receivePayment: builder.mutation<ResponseData, UserData>({
			query: (userData) => ({
				url: '/user/receive',
				method: 'POST',
				body: userData,
			}),
		}),

		current: builder.query<ResponseData, void>({
			query: () => ({
				url: '/user/current',
				method: 'GET',
			}),
		}),
	}),
})

export const {
	useLoginMutation,
	useRegisterMutation,
	useRegisterConfirmMutation,
	useRecoveryMutation,
	useRecoveryConfirmMutation,
	useNewEmailMutation,
	useNewPasswordMutation,
	useSendPaymentMutation,
	useReceivePaymentMutation,
	useCurrentQuery,
} = authApi
export const {
	endpoints: {
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
	},
} = authApi
