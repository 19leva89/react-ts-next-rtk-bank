'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

import './style.css'

interface Props {
	children: ReactNode
	className: string
	link: string
	onClick?: () => void
}

export const Button = ({ children, className, link, onClick }: Props) => {
	return (
		<Link href={link} type="submit" className={className} onClick={onClick}>
			{children}
		</Link>
	)
}
