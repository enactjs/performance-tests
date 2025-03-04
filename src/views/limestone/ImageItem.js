import kind from '@enact/core/kind';
import ImageItem from '@enact/limestone/ImageItem';

const ImageItemView = kind({
	name: 'ImageItemView',

	render: () => (
		<ImageItem id="imageItem" src="https://placehold.co/600x600">
			ImageItem Caption
		</ImageItem>
	)
});

export default ImageItemView;
