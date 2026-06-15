import Image from 'next/image'

import { Paths } from '@/constants/paths'
import { Button } from '@/components/shared'

export default function HomePage() {
	return (
		<main>
			<Image
				className='background--img'
				src='/img/background.png'
				alt='Background'
				width={393}
				height={583}
			/>

			<section className='wrapper'>
				<h1 className='wrapper__title'>Hello!</h1>
				<p className='wrapper__text'>Welcome to bank app</p>
				<Image
					className='background-safe--img'
					src='/img/background-safe.png'
					alt='Background safe'
					width={403}
					height={398}
				/>
			</section>

			<div className='wrapper__button'>
				<Button className='button button__primary' link={Paths.register}>
					<span className='button--name'>Register</span>
				</Button>

				<Button className='button button__transparent' link={Paths.login}>
					<span className='button--name'>Login</span>
				</Button>
			</div>
		</main>
	)
}
