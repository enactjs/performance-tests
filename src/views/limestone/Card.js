import kind from '@enact/core/kind';
import Card from '@enact/limestone/Card';

const imageSize = {height: 300, width: 300};

const CardView = kind({
	name: 'CardView',

	render: () => (
		<Card
			id="card"
			src="https://placehold.co/600x600"
			imageIconSrc="https://placehold.co/64x64"
			primaryBadgeSrc="https://placehold.co/48x48"
			secondaryBadgeSrc="https://placehold.co/48x48"
			icon="list"
			label="A secondary caption"
			secondaryLabel="A ternary caption"
			orientation="vertical"
			imageSize={imageSize}
			captionOverlayOnFocus
			splitCaption
			hasContainer
			roundedImage
			showProgressBar
			progress={0.4}
			selected
		>
			The primary caption
		</Card>
	)
});

export default CardView;
