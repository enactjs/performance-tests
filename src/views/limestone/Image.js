import kind from '@enact/core/kind';
import Image from '@enact/limestone/Image';

const ImageView = kind({
	name: 'ImageView',

	render: () => (
		<>
			<p>Image</p>
			<Image id="image" src="https://placehold.co/600x600" />
		</>
	)
});

export default ImageView;
