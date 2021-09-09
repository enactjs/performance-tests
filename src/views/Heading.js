import kind from '@enact/core/kind';
import Heading from '@enact/sandstone/Heading';
import {putRenderedMark} from '../utils';

import {Profiler} from 'react';

const HeadingView = kind({
	name: 'HeadingView',

	render: () => (
		<Profiler id="heading-rendered" onRender={putRenderedMark}>
			<Heading id="heading" showLine>
				This is a heading!
			</Heading>
		</Profiler>
	)
});

export default HeadingView;
