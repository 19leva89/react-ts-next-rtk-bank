'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FieldError, useForm } from 'react-hook-form'

import { Paths } from '@/constants/paths'
import { REG_EXP_EMAIL } from '@/utils/constants'
import { useRegisterMutation } from '@/lib/services/auth'
import { isErrorWithMsg } from '@/utils/is-error-with-msg'
import { Alert, AlertStatus, ButtonBack, Field, FieldPassword, Form } from '@/components/shared'

const RegisterPage = () => {
	const router = useRouter()
	const [registerUser] = useRegisterMutation()
	const [msg, setMsg] = useState('')
	const [msgType, setMsgType] = useState<AlertStatus>('disabled')
	const {
		register,
		handleSubmit,
		setFocus,
		formState: { errors, isValid, isSubmitting },
	} = useForm({ mode: 'onTouched' })

	useEffect(() => {
		setFocus('email')
	}, [setFocus])

	const onSubmit = async (data: any) => {
		setMsg('')

		try {
			const res = await registerUser(data).unwrap()

			setMsgType('success')
			setMsg(res.msg)

			router.push(Paths.registerConfirm)
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
				<h1 className="form__title">Register</h1>

				<p className="form__text">Choose a registration method</p>

				<div className="form">
					<div className="form__item">
						<Field
							type="email"
							name="email"
							label="Email"
							placeholder="Enter your email"
							register={register}
							patternValue={REG_EXP_EMAIL}
							patternMessage="Please enter a valid email address"
							errors={errors as Record<string, FieldError>}
						/>
					</div>

					<div className="form__item">
						<FieldPassword
							name="password"
							label="Password"
							placeholder="Enter your password"
							register={register}
							errors={errors as Record<string, FieldError>}
						/>
					</div>
				</div>

				<div className="form__item">
					<span className="link__prefix">
						Already have an account?
						<Link href="/login" className="link">
							<> </>Login
						</Link>
					</span>
				</div>

				<button
					className={`button button__primary ${!isValid || isSubmitting ? 'button--disabled' : ''}`}
					type="submit"
					disabled={!isValid || isSubmitting}
				>
					Continue
				</button>

				<section className="form__item form__alert">
					<Alert status={msgType} message={msg} />
				</section>
			</Form>
		</main>
	)
}

export default RegisterPage
