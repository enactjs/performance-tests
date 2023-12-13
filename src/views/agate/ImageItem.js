import ImageItem from '@enact/agate/ImageItem';
import kind from '@enact/core/kind';
import ri from '@enact/ui/resolution';

const ImageItemView = kind({
	name: 'ImageItemView',

	render: () => (
		<ImageItem
			id="imageItem"
			src="https://via.placeholder.com/600x600"
			style={{width: ri.scaleToRem(600), height: ri.scaleToRem(600)}}
		>
			Image Item caption
		</ImageItem>
	)
});

export default ImageItemView;
