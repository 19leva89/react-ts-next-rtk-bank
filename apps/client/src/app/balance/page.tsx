'use client'

import Link from 'next/link'
import { format } from 'date-fns'

import { useCurrentQuery } from '@/lib/services/auth'
import { Button, Loader, Skeleton } from '@/components/shared'

const BalancePage = () => {
	const { data: user, isLoading } = useCurrentQuery()

	return (
		<main>
			{isLoading && <Loader />}

			<img className="background-balance--img" src="/img/background-balance.png" alt="background balance" />

			<section className="wrapper__menu">
				<Button className="" link="/settings">
					<img className="menu__settings" src="/svg/settings.svg" alt="Menu" />
				</Button>

				<p className="menu__text">Main wallet</p>

				<Button className="" link="/notifications">
					<img className="menu__notification" src="/svg/notification-ico.svg" alt="Notification" />
				</Button>
			</section>

			<section className="wrapper__balance">
				<h1 className="balance__title">
					{user && user.balance !== null ? `$ ${Math.abs(user.balance).toFixed(2)}` : '...'}
				</h1>
			</section>

			<section className="wrapper__transaction">
				<div className="transaction__receive">
					<Button className="" link="/receive">
						<img className="transaction__img" src="/svg/receive.svg" alt="Receive" />
					</Button>
					<span className="transaction__title">Receive</span>
				</div>

				<div className="transaction__send">
					<Button className="" link="/send">
						<img className="transaction__img" src="/svg/send.svg" alt="Send" />
					</Button>
					<span className="transaction__title">Send</span>
				</div>
			</section>

			{isLoading && (
				<section className="wrapper__movement">
					<Skeleton />
				</section>
			)}

			{user && (
				<section className="wrapper__movement">
					{user.transactions
						.slice()
						.reverse()
						.slice(0, 20)
						.map((transaction) => (
							<Link className="" href={`/transaction/${transaction.id}`} key={transaction.id}>
								<div className="movement">
									<div className="movement__content">
										<img
											className="movement__img"
											src={
												(transaction.paymentSystem === 'Stripe' && '/svg/payment/stripe.svg') ||
												(transaction.paymentSystem === 'Coinbase' && '/svg/payment/coinbase.svg') ||
												user.img
											}
											alt={transaction.paymentSystem}
										/>

										<div className="movement__details">
											<div className="movement__name">{transaction.paymentSystem}</div>
											<div className="movement__specialty">
												<div className="movement__time">
													{format(new Date(transaction.date), 'HH:mm dd.MM.yy')}
												</div>
												<div className="movement__status">{transaction.status}</div>
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
