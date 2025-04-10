'use client'

import { formatDistanceToNow } from 'date-fns'

import { useCurrentQuery } from '@/lib/services/auth'
import { ButtonBack, Loader, Skeleton } from '@/components/shared'

const NotificationsPage = () => {
	const { data: user, isLoading } = useCurrentQuery()

	return (
		<main className="main__container main__container--gray">
			<div className="menu__container">
				{isLoading && <Loader />}

				<ButtonBack />

				<h1 className="form__title">Notifications</h1>

				<div className="stub"></div>
			</div>

			{isLoading && (
				<section className="notification__wrapper">
					<Skeleton />
				</section>
			)}

			{user && (
				<div className="notifications__container">
					{user.notifications
						.slice()
						.reverse()
						.slice(0, 20)
						.map((notify, i) => {
							const timeAgo = formatDistanceToNow(new Date(notify.eventTime), { addSuffix: true })
							const getImageByEventType = (eventType: string) => {
								if (eventType === 'Announcement') {
									return '/svg/notification-btn.svg'
								} else if (eventType === 'Warning') {
									return '/svg/danger-btn.svg'
								} else {
									// Якщо eventType не співпадає з жодним з очікуваних значень
									return undefined
								}
							}

							return (
								<div key={`login-${i}`} className="notification__wrapper">
									<div className="notification__item">
										<img src={getImageByEventType(notify.eventType)} alt={notify.eventType} />
										<div className="notification__content">
											<div className="notification__title">New {notify.eventTitle}</div>
											<div className="notification__subtitle">
												<div className="notification__time">{timeAgo}</div>
												<div className="notification__event">{notify.eventType}</div>
											</div>
										</div>
									</div>
								</div>
							)
						})}
				</div>
			)}
		</main>
	)
}

export default NotificationsPage
