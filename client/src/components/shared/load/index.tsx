import './style.css'

export type AlertStatus = 'success' | 'progress' | 'disabled' | 'error' | undefined

interface Props {
	status: 'success' | 'progress' | 'disabled' | 'error' | undefined
	message: string | null
}

export const Alert = ({ status, message }: Props) => {
	return <div className={`alert alert--${status}`}>{message}</div>
}

export const Loader = () => {
	return <div className="loader"></div>
}

export const Skeleton = () => {
	return (
		<div className="skeleton">
			<div className="skeleton__item"></div>
			<div className="skeleton__item"></div>
			<div className="skeleton__item"></div>
		</div>
	)
}
