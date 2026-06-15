'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

export const ButtonBack = () => {
	const router = useRouter()

	const handleClick = () => {
		router.back()
	}

	return (
		<div className='button button__back'>
			<Image src='/svg/button-back.svg' alt='<' width='24' height='24' onClick={handleClick} />
		</div>
	)
}
