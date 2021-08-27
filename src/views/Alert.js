import kind from '@enact/core/kind';
import Alert from '@enact/sandstone/Alert';
import Button from '@enact/sandstone/Button';

import {Profiler} from 'react';

function putRenderedMark(id, phase, actualDuration, baseDuration, startTime, commitTime) {
	if (!window._prf) {
		window._prf = [];
	}

	window._prf.push({id, phase, actualDuration, baseDuration, startTime, commitTime});

	if (!putRenderedMark._done) {
		putRenderedMark._done = true;
		window.performance.mark('alert-rendered');
	}
}

const AlertView = kind({
	name: 'AlertView',

	render: () => (
		<Profiler id="alert-rendered" onRender={putRenderedMark}>
			<Alert id='alert' open type="fullscreen">
				<span>
					This is alert Fullscreen.
				</span>
				<buttons>
					<Button id='button'>yes</Button>
				</buttons>
			</Alert>
		</Profiler>
	)
});

export default AlertView;
