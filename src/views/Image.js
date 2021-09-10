import kind from '@enact/core/kind';
import Image from '@enact/sandstone/Image';
import {putRenderedMark} from '../utils';

import {Profiler} from 'react';

const ImageView = kind({
	name: 'ImageView',

	render: () => (
		<Profiler id="image-rendered" onRender={putRenderedMark}>
			<Image id="image" src="http://via.placeholder.com/600x600" />
		</Profiler>
	)
});

export default ImageView;
