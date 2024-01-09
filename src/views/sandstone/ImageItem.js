import kind from '@enact/core/kind';
import ImageItem from '@enact/sandstone/ImageItem';

const ImageItemView = kind({
	name: 'ImageItemView',

	render: () => (
		<ImageItem id="imageItem" src="https://via.placeholder.com/600x600">
			ImageItem Caption
		</ImageItem>
	)
});

export default ImageItemView;
