'use client'

import { useEffect, useState } from 'react'
import { FieldError, useForm } from 'react-hook-form'

import { isErrorWithMsg } from '@/utils/is-error-with-msg'
import { useSendPaymentMutation } from '@/lib/services/auth'
import { REG_EXP_AMOUNT, REG_EXP_EMAIL } from '@/utils/constants'
import { Alert, AlertStatus, ButtonBack, Field, Form, Loader } from '@/components/shared'

const SendPage = () => {
	const [sendPayment] = useSendPaymentMutation()
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
			const res = await sendPayment(data).unwrap()

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

	return (
		<main className="main__container">
			{isSubmitting && <Loader />}

			<ButtonBack />

			<Form onSubmit={handleSubmit(onSubmit)}>
				<h1 className="form__title">Send</h1>

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
						<Field
							type="number"
							name="amount"
							label="Amount"
							placeholder="$"
							register={register}
							patternValue={REG_EXP_AMOUNT}
							patternMessage="Please input a valid number above zero"
							errors={errors as Record<string, FieldError>}
						/>
					</div>
				</div>

				<button
					className={`button button__primary ${!isValid || isSubmitting ? 'button--disabled' : ''}`}
					type="submit"
					disabled={!isValid || isSubmitting}
				>
					Send
				</button>

				<section className="form__item form__item--slim form__alert">
					<Alert status={msgType} message={msg} />
				</section>
			</Form>
		</main>
	)
}

export default SendPage
