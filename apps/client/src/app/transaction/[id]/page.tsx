'use client'

import { format } from 'date-fns'
import { useParams } from 'next/navigation'

import { useCurrentQuery } from '@/lib/services/auth'
import { ButtonBack, Divider, Form, Loader } from '@/components/shared'

const TransactionPage = () => {
	const { data: user, isLoading } = useCurrentQuery()
	const { id } = useParams<{ id: string }>()

	const transaction = user?.transactions.find((t) => t.id === id)

	if (!transaction) {
		return <div>Transaction not found</div>
	}

	return (
		<main className="main__container main__container--gray">
			<div className="menu__container">
				{isLoading && <Loader />}

				<ButtonBack />
				<h1 className="form__title">Transaction</h1>
				<div className="stub"></div>
			</div>

			<div className="transaction__container">
				<Form onSubmit={() => {}}>
					<div className="form">
						<h1
							className={`form__text--h1 movement__cost ${
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
						</h1>

						<div className="form__item">
							<div className="transaction__wrapper">
								<div className="transaction__date">
									<div>Date</div>
									<div>{format(new Date(transaction.date), 'dd MMM, HH:mm')}</div>
								</div>

								<Divider className="divider__transaction" />

								<div className="transaction__address">
									<div>Address</div>
									<div>{transaction.paymentSystem}</div>
								</div>

								<Divider className="divider__transaction" />

								<div className="transaction__type">
									<div>Type</div>
									<div>{transaction.status}</div>
								</div>
							</div>
						</div>
					</div>
				</Form>
			</div>
		</main>
	)
}

export default TransactionPage
