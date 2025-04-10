'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FieldError, useForm } from 'react-hook-form'

import { Paths } from '@/constants/paths'
import { REG_EXP_CODE } from '@/utils/constants'
import { isErrorWithMsg } from '@/utils/is-error-with-msg'
import { useRegisterConfirmMutation } from '@/lib/services/auth'
import { Alert, AlertStatus, ButtonBack, Field, Form } from '@/components/shared'

const RegisterConfirmPage = () => {
	const router = useRouter()
	const [registerConfirmUser] = useRegisterConfirmMutation()
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
			const res = await registerConfirmUser(data).unwrap()

			setMsgType('success')
			setMsg(res.msg)

			router.push(Paths.balance)
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
				<h1 className="form__title">Confirm account</h1>

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
				</div>

				<button
					className={`button button__primary ${!isValid || isSubmitting ? 'button--disabled' : ''}`}
					type="submit"
					disabled={!isValid || isSubmitting}
				>
					Confirm
				</button>

				<section className="form__item form__alert">
					<Alert status={msgType} message={msg} />
				</section>
			</Form>
		</main>
	)
}

export default RegisterConfirmPage
