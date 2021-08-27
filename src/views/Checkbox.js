import kind from '@enact/core/kind';
import Checkbox from '@enact/sandstone/Checkbox';

import {Profiler} from 'react';

function putRenderedMark(id, phase, actualDuration, baseDuration, startTime, commitTime) {
	if (!window._prf) {
		window._prf = [];
	}

	window._prf.push({id, phase, actualDuration, baseDuration, startTime, commitTime});

	if (!putRenderedMark._done) {
		putRenderedMark._done = true;
		window.performance.mark('checkbox-rendered');
	}
}

const CheckboxView = kind({
	name: 'CheckboxView',

	render: () => (
		<Profiler id="checkbox-rendered" onRender={putRenderedMark}>
			<Checkbox id="checkbox" />
		</Profiler>
	)
});

export default CheckboxView;
