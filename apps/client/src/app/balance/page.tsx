'use client'

import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

import { useCurrentQuery } from '@/lib/services/auth'
import { Button, Loader, Skeleton } from '@/components/shared'

const BalancePage = () => {
	const { data: user, isLoading } = useCurrentQuery()

	return (
		<main>
			{isLoading && <Loader />}

			<Image
				className='background-balance--img'
				src='/img/background-balance.png'
				alt='background balance'
				width={394}
				height={203}
			/>

			<section className='wrapper__menu'>
				<Button className='' link='/settings'>
					<Image className='menu__settings' src='/svg/settings.svg' alt='Menu' width={24} height={24} />
				</Button>

				<p className='menu__text'>Main wallet</p>

				<Button className='' link='/notifications'>
					<Image
						className='menu__notification'
						src='/svg/notification-ico.svg'
						alt='Notification'
						width={24}
						height={24}
					/>
				</Button>
			</section>

			<section className='wrapper__balance'>
				<h1 className='balance__title'>
					{user && user.balance !== null ? `$ ${Math.abs(user.balance).toFixed(2)}` : '...'}
				</h1>
			</section>

			<section className='wrapper__transaction'>
				<div className='transaction__receive'>
					<Button className='' link='/receive'>
						<Image className='transaction__img' src='/svg/receive.svg' alt='Receive' width={72} height={72} />
					</Button>
					<span className='transaction__title'>Receive</span>
				</div>

				<div className='transaction__send'>
					<Button className='' link='/send'>
						<Image className='transaction__img' src='/svg/send.svg' alt='Send' width={72} height={72} />
					</Button>
					<span className='transaction__title'>Send</span>
				</div>
			</section>

			{isLoading && (
				<section className='wrapper__movement'>
					<Skeleton />
				</section>
			)}

			{user && (
				<section className='wrapper__movement'>
					{user.transactions
						.slice()
						.reverse()
						.slice(0, 20)
						.map((transaction) => (
							<Link className='' href={`/transaction/${transaction.id}`} key={transaction.id}>
								<div className='movement'>
									<div className='movement__content'>
										<Image
											className='movement__img'
											src={
												(transaction.paymentSystem === 'Stripe' && '/svg/payment/stripe.svg') ||
												(transaction.paymentSystem === 'Coinbase' && '/svg/payment/coinbase.svg') ||
												user.img
											}
											alt={transaction.paymentSystem}
											width={48}
											height={48}
										/>

										<div className='movement__details'>
											<div className='movement__name'>{transaction.paymentSystem}</div>
											<div className='movement__specialty'>
												<div className='movement__time'>
													{format(new Date(transaction.date), 'HH:mm dd.MM.yy')}
												</div>
												<div className='movement__status'>{transaction.status}</div>
											</div>
										</div>
									</div>

									<div
										className={`movement__cost ${
											transaction.status === 'Receive' ? 'movement__cost--plus' : 'movement__cost--minus'
										}`}
									>
										{transaction.status === 'Receive'
											? `+$${Math.abs(transaction.amount)
													.toFixed(2)
													.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
											: `-$${Math.abs(transaction.amount)
													.toFixed(2)
													.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
									</div>
								</div>
							</Link>
						))}
				</section>
			)}
		</main>
	)
}

export default BalancePage
