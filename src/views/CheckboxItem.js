import kind from '@enact/core/kind';
import CheckboxItem from '@enact/sandstone/CheckboxItem';

import {Profiler} from 'react';

function putRenderedMark(id, phase, actualDuration, baseDuration, startTime, commitTime) {
	if (!window._prf) {
		window._prf = [];
	}

	window._prf.push({id, phase, actualDuration, baseDuration, startTime, commitTime});

	if (!putRenderedMark._done) {
		putRenderedMark._done = true;
		window.performance.mark('checkboxItem-rendered');
	}
}

const CheckboxItemView = kind({
	name: 'CheckboxItemView',

	render: () => (
		<Profiler id="checkboxItem-rendered" onRender={putRenderedMark}>
			<CheckboxItem id="checkboxItem">This is a checkbox item</CheckboxItem>
		</Profiler>
	)
});

export default CheckboxItemView;
