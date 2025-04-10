'use client'

import { useState } from 'react'
import { FieldError, UseFormRegister } from 'react-hook-form'

import { REG_EXP_PASSWORD } from '@/utils/constants'

import './style.css'

interface Props {
	name: string
	label: string
	placeholder: string
	register: UseFormRegister<any>
	errors: Record<string, FieldError>
}

export const FieldPassword = ({ name, label, placeholder, register, errors }: Props) => {
	const [showPassword, setShowPassword] = useState(false)

	const toggleIcon = () => {
		setShowPassword((prevState) => !prevState)
	}

	return (
		<>
			<div className="field field--password">
				<label
					htmlFor={name}
					className={`field__label field__error ${errors[name] ? 'field__error--active' : ''}`}
				>
					{label}
				</label>

				<div className="field__wrapper">
					<input
						className={`field__input validation ${errors[name] ? 'validation--active' : ''}`}
						type={showPassword ? 'text' : 'password'}
						placeholder={placeholder}
						{...register(name, {
							required: 'This field is required',
							maxLength: { value: 20, message: 'Max length is 20 characters' },
							pattern: {
								value: REG_EXP_PASSWORD,
								message:
									'The password must be at least 8 characters long and contain both uppercase and lowercase letters, as well as numbers',
							},
						})}
					/>
					<span className={`field__icon ${showPassword ? 'show' : ''}`} onClick={toggleIcon} />
				</div>
			</div>

			<span className={`form__error ${errors[name] ? 'form__error--active' : ''}`} data-name={name}>
				{errors[name]?.message}
			</span>
		</>
	)
}
