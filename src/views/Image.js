import kind from '@enact/core/kind';
import Image from '@enact/sandstone/Image';

const ImageView = kind({
	name: 'ImageView',

	render: () => (
		<Image id="image" src="http://via.placeholder.com/600x600" />
	)
});

export default ImageView;
