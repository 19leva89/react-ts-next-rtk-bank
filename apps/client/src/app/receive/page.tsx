'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FieldError, useForm } from 'react-hook-form'

import { REG_EXP_AMOUNT } from '@/utils/constants'
import { isErrorWithMsg } from '@/utils/is-error-with-msg'
import { useReceivePaymentMutation } from '@/lib/services/auth'
import { Alert, AlertStatus, ButtonBack, Divider, Field, Form, Loader } from '@/components/shared'

const ReceivePage = () => {
	const [receivePayment] = useReceivePaymentMutation()
	const [msg, setMsg] = useState<string>('')
	const [msgType, setMsgType] = useState<AlertStatus>('disabled')

	const {
		register,
		handleSubmit,
		setFocus,
		formState: { errors, isValid, isSubmitting },
		watch,
	} = useForm({ mode: 'onTouched' })

	useEffect(() => {
		setFocus('amount')
	}, [setFocus])

	const amount = watch('amount')

	const onSubmit = async (data: any) => {
		setMsg('')

		try {
			const res = await receivePayment(data).unwrap()

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
		<main className='main__container main__container--gray'>
			<div className='menu__container'>
				{isSubmitting && <Loader />}

				<ButtonBack />
				<h1 className='form__title'>Receive</h1>
				<div className='stub'></div>
			</div>

			<div className='receive__container'>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<div className='form form--slim'>
						<p className='form__text form__text--big form__text--left'>Receive amount</p>
						<div className='form__item form__item--slim'>
							<Field
								type='number'
								name='amount'
								placeholder='$'
								register={register}
								patternValue={REG_EXP_AMOUNT}
								patternMessage='Please input a valid number above zero'
								errors={errors as Record<string, FieldError>}
							/>
						</div>
					</div>

					<Divider className='divider' />

					<p className='form__text form__text--big form__text--left'>Payment system</p>
					<button
						className={`button button__transparent button__fat ${
							!isValid || isSubmitting ? 'button--disabled' : ''
						}`}
						type='submit'
						disabled={!isValid || isSubmitting}
						onClick={() => onSubmit({ amount: amount, paymentSystem: 'Stripe' })}
					>
						<div className='payment__container'>
							<div className='payment__wrapper'>
								<Image src='/svg/payment/stripe.svg' alt='Stripe' width={48} height={48} />
								<div className='payment__title'>Stripe</div>
							</div>

							<div className='payment__ico'>
								<Image src='/svg/payment/mastercard-ico.svg' alt='Mastercard' width={22} height={22} />
								<Image src='/svg/payment/tron-green-ico.svg' alt='Tron green' width={22} height={22} />
								<Image src='/svg/payment/bitcoin-ico.svg' alt='Bitcoin' width={22} height={22} />
								<Image src='/svg/payment/tron-red-ico.svg' alt='Tron red' width={22} height={22} />
								<Image src='/svg/payment/ethereum-ico.svg' alt='Ethereum' width={22} height={22} />
								<Image src='/svg/payment/binance-ico.svg' alt='Binance' width={22} height={22} />
							</div>
						</div>
					</button>

					<button
						className={`button button__transparent button__fat ${
							!isValid || isSubmitting ? 'button--disabled' : ''
						}`}
						type='submit'
						disabled={!isValid || isSubmitting}
						onClick={() => onSubmit({ amount: amount, paymentSystem: 'Coinbase' })}
					>
						<div className='payment__container'>
							<div className='payment__wrapper'>
								<Image src='/svg/payment/coinbase.svg' alt='Coinbase' width={48} height={48} />
								<div className='payment__title'>Coinbase</div>
							</div>

							<div className='payment__ico'>
								<Image src='/svg/payment/tron-green-ico.svg' alt='Tron green' width={22} height={22} />
								<Image src='/svg/payment/mastercard-ico.svg' alt='Mastercard' width={22} height={22} />
								<Image src='/svg/payment/tron-red-ico.svg' alt='Tron red' width={22} height={22} />
								<Image src='/svg/payment/bitcoin-ico.svg' alt='Bitcoin' width={22} height={22} />
								<Image src='/svg/payment/binance-ico.svg' alt='Binance' width={22} height={22} />
								<Image src='/svg/payment/ethereum-ico.svg' alt='Ethereum' width={22} height={22} />
							</div>
						</div>
					</button>

					<section className='form__item form__item--slim form__alert'>
						<Alert status={msgType} message={msg} />
					</section>
				</Form>
			</div>
		</main>
	)
}

export default ReceivePage
