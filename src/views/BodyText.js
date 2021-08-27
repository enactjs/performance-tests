import kind from '@enact/core/kind';
import BodyText from '@enact/sandstone/BodyText';

import {Profiler} from 'react';

function putRenderedMark(id, phase, actualDuration, baseDuration, startTime, commitTime) {
	if (!window._prf) {
		window._prf = [];
	}

	window._prf.push({id, phase, actualDuration, baseDuration, startTime, commitTime});

	if (!putRenderedMark._done) {
		putRenderedMark._done = true;
		window.performance.mark('bodyText-rendered');
	}
}

const BodyTextView = kind({
	name: 'BodyTextView',

	render: () => (
		<Profiler id="bodyText-rendered" onRender={putRenderedMark}>
			<BodyText id='bodyText'>
				This is a text on the screen!
			</BodyText>
		</Profiler>
	)
});

export default BodyTextView;
