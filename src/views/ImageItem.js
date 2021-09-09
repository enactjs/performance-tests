import kind from '@enact/core/kind';
import ImageItem from '@enact/sandstone/ImageItem';
import {putRenderedMark} from '../utils';

import {Profiler} from 'react';

const ImageItemView = kind({
	name: 'ImageItemView',

	render: () => (
		<Profiler id="imageItem-rendered" onRender={putRenderedMark}>
			<ImageItem id="imageItem" src="http://via.placeholder.com/600x600">
				ImageItem Caption
			</ImageItem>
		</Profiler>
	)
});

export default ImageItemView;
