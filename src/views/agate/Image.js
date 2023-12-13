import Image from '@enact/agate/Image';
import kind from '@enact/core/kind';

const ImageView = kind({
	name: 'ImageView',

	render: () => (
		<>
			<p>Image</p>
			<Image id="image" src="https://via.placeholder.com/600x600" />
		</>
	)
});

export default ImageView;
