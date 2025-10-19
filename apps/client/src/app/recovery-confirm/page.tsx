'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FieldError, useForm } from 'react-hook-form'

import { Paths } from '@/constants/paths'
import { REG_EXP_CODE } from '@/utils/constants'
import { isErrorWithMsg } from '@/utils/is-error-with-msg'
import { useRecoveryConfirmMutation } from '@/lib/services/auth'
import { Alert, AlertStatus, ButtonBack, Field, FieldPassword, Form } from '@/components/shared'

const RecoveryConfirmPage = () => {
	const router = useRouter()
	const [recoveryConfirmUser] = useRecoveryConfirmMutation()
	const [msg, setMsg] = useState('')
	const [msgType, setMsgType] = useState<AlertStatus>('disabled')
	const {
		register,
		handleSubmit,
		setFocus,
		formState: { errors, isValid, isSubmitting },
	} = useForm({ mode: 'onTouched' })

	useEffect(() => {
		setFocus('code')
	}, [setFocus])

	const onSubmit = async (data: any) => {
		setMsg('')

		try {
			const res = await recoveryConfirmUser(data).unwrap()

			setMsgType('success')
			setMsg(res.msg)

			router.push(Paths.login)
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

	return (
		<main className="main__container">
			<ButtonBack />

			<Form onSubmit={handleSubmit(onSubmit)}>
				<h1 className="form__title">Changing the password</h1>

				<p className="form__text">Write the code you received</p>

				<div className="form">
					<div className="form__item">
						<Field
							type="number"
							name="code"
							label="Code"
							placeholder="Enter your code"
							register={register}
							patternValue={REG_EXP_CODE}
							patternMessage="Enter a six-digit number"
							errors={errors as Record<string, FieldError>}
						/>
					</div>

					<div className="form__item">
						<FieldPassword
							name="newPassword"
							label="New password"
							placeholder="Enter your new password"
							register={register}
							errors={errors as Record<string, FieldError>}
						/>
					</div>
				</div>

				<button
					className={`button button__primary ${!isValid || isSubmitting ? 'button--disabled' : ''}`}
					type="submit"
					disabled={!isValid || isSubmitting}
				>
					Change password
				</button>

				<section className="form__item form__alert">
					<Alert status={msgType} message={msg} />
				</section>
			</Form>
		</main>
	)
}

export default RecoveryConfirmPage
