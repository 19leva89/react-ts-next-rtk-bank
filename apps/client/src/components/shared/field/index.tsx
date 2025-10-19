import { FieldError, UseFormRegister } from 'react-hook-form'

import './style.css'

interface Props {
	type: string
	name: string
	label?: string
	placeholder: string
	register: UseFormRegister<any>
	patternValue: RegExp
	patternMessage: string
	errors: Record<string, FieldError>
}

export const Field = ({
	type,
	name,
	label,
	placeholder,
	register,
	patternValue,
	patternMessage,
	errors,
}: Props) => {
	return (
		<>
			<div className="field">
				{label && (
					<label
						htmlFor={name}
						className={`field__label field__error ${errors[name] ? 'field__error--active' : ''}`}
					>
						{label}
					</label>
				)}
				<input
					className={`field__input validation ${errors[name] ? 'validation--active' : ''}`}
					type={type}
					placeholder={placeholder}
					{...register(name, {
						required: 'This field is required',
						pattern: {
							value: patternValue,
							message: patternMessage,
						},
					})}
				/>
			</div>
			{errors[name] && (
				<span className={`form__error ${errors[name] ? 'form__error--active' : ''}`} data-name={name}>
					{errors[name]?.message}
				</span>
			)}
		</>
	)
}
