'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FieldError, useForm } from 'react-hook-form'

import {
	Alert,
	AlertStatus,
	ButtonBack,
	Divider,
	Field,
	FieldPassword,
	Form,
	Loader,
} from '@/components/shared'
import { Paths } from '@/constants/paths'
import { useAppDispatch } from '@/lib/hooks'
import { REG_EXP_EMAIL } from '@/utils/constants'
import { logout } from '@/features/auth/authSlice'
import { isErrorWithMsg } from '@/utils/is-error-with-msg'
import { useNewEmailMutation, useNewPasswordMutation } from '@/lib/services/auth'

const SettingsPage = () => {
	const router = useRouter()
	const dispatch = useAppDispatch()
	const [changeEmailUser] = useNewEmailMutation()
	const [changePasswordUser] = useNewPasswordMutation()
	const [msg, setMsg] = useState('')
	const [msgType, setMsgType] = useState<AlertStatus>('disabled')

	const {
		register: registerEmail,
		handleSubmit: handleSubmitEmail,
		formState: { errors: emailErrors, isValid: isEmailValid, isSubmitting: isEmailSubmitting },
	} = useForm({ mode: 'onTouched' })

	const {
		register: registerPassword,
		handleSubmit: handleSubmitPassword,
		formState: { errors: passwordErrors, isValid: isPasswordValid, isSubmitting: isPasswordSubmitting },
	} = useForm({ mode: 'onTouched' })

	const changeEmail = async (data: any) => {
		setMsg('')

		try {
			const res = await changeEmailUser(data).unwrap()

			setMsgType('success')
			setMsg(res.msg)
		} catch (err) {
			const maybeError = isErrorWithMsg(err)

			if (maybeError) {
				setMsgType('error')
				setMsg(err.data.msg)
			} else {
				setMsgType('error')
				setMsg('Не відома помилка')
			}
		}
	}

	const changePassword = async (data: any) => {
		setMsg('')

		try {
			const res = await changePasswordUser(data).unwrap()

			setMsgType('success')
			setMsg(res.msg)
		} catch (err) {
			const maybeError = isErrorWithMsg(err)

			if (maybeError) {
				setMsgType('error')
				setMsg(err.data.msg)
			} else {
				setMsgType('error')
				setMsg('Не відома помилка')
			}
		}
	}

	const onLogoutClick = () => {
		dispatch(logout())
		localStorage.removeItem('token')
		router.push(Paths.home)
	}

	return (
		<main className="main__container">
			{(isEmailSubmitting || isPasswordSubmitting) && <Loader />}

			<div className="menu__container">
				<ButtonBack />
				<h1 className="form__title">Settings</h1>
				<div className="stub"></div>
			</div>

			<div className="wrapper__settings">
				<Form onSubmit={handleSubmitEmail(changeEmail)}>
					<p className="form__text form__text--big">Change email</p>

					<div className="form form--slim">
						<div className="form__item form__item--slim">
							<Field
								type="email"
								name="newEmail"
								label="New email"
								placeholder="Enter your new email"
								register={registerEmail}
								patternValue={REG_EXP_EMAIL}
								patternMessage="Please enter a valid email address"
								errors={emailErrors as Record<string, FieldError>}
							/>
						</div>

						<div className="form__item form__item--slim">
							<FieldPassword
								name="password"
								label="Password"
								placeholder="Enter your password"
								register={registerEmail}
								errors={emailErrors as Record<string, FieldError>}
							/>
						</div>
					</div>

					<button
						className={`button button__transparent button__slim ${
							!isEmailValid || isEmailSubmitting ? 'button--disabled' : ''
						}`}
						type="submit"
						disabled={!isEmailValid || isEmailSubmitting}
					>
						Save Email
					</button>
				</Form>

				<Divider className="divider" />

				<Form onSubmit={handleSubmitPassword(changePassword)}>
					<p className="form__text form__text--big">Change password</p>

					<div className="form form--slim">
						<div className="form__item form__item--slim">
							<FieldPassword
								name="oldPassword"
								label="Old password"
								placeholder="Enter your old password"
								register={registerPassword}
								errors={passwordErrors as Record<string, FieldError>}
							/>
						</div>

						<div className="form__item form__item--slim">
							<FieldPassword
								name="newPassword"
								label="New password"
								placeholder="Enter your new password"
								register={registerPassword}
								errors={passwordErrors as Record<string, FieldError>}
							/>
						</div>
					</div>

					<button
						className={`button button__transparent button__slim ${
							!isPasswordValid || isPasswordSubmitting ? 'button--disabled' : ''
						}`}
						type="submit"
						disabled={!isPasswordValid || isPasswordSubmitting}
					>
						Save Password
					</button>
				</Form>

				<Divider className="divider" />

				<Form onSubmit={onLogoutClick}>
					<button className={'button button__warning button__slim'} type="submit">
						Logout
					</button>

					<section className="form__item form__alert">
						<Alert status={msgType} message={msg} />
					</section>
				</Form>
			</div>
		</main>
	)
}

export default SettingsPage
