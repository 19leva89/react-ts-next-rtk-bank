import './style.css'

export const NotFoundBlock = () => {
	return (
		<div className="not-found">
			<h1 className="not-found__title">
				<div className="not-found__smile" role="img" aria-label="sad face">
					😕
				</div>
				Нічого не знайдено
			</h1>

			<p className="not-found__description">На жаль, ця сторінка відсутня на нашому сайті</p>
		</div>
	)
}
