import kind from '@enact/core/kind';
import BodyText from '@enact/sandstone/BodyText';
import {putRenderedMark} from '../utils';

import {Profiler} from 'react';

const BodyTextView = kind({
	name: 'BodyTextView',

	render: () => (
		<Profiler id="bodyText-rendered" onRender={putRenderedMark}>
			<BodyText id="bodyText">
				This is a text on the screen!
			</BodyText>
		</Profiler>
	)
});

export default BodyTextView;
