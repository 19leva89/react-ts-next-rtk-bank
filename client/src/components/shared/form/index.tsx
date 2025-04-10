'use client'

import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'

interface Props {
	children: ReactNode
	onSubmit: (data: any) => void
}

export const Form = ({ children, onSubmit }: Props) => {
	const { handleSubmit } = useForm({ mode: 'onTouched' })

	const onSubmitHandler = handleSubmit((data: any) => {
		onSubmit(data)
	})

	return (
		<form className="form__container" onSubmit={onSubmitHandler}>
			{children}
		</form>
	)
}
