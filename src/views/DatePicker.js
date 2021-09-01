import kind from '@enact/core/kind';
import DatePicker from '@enact/sandstone/DatePicker';

import {Profiler} from 'react';

function putRenderedMark(id, phase, actualDuration, baseDuration, startTime, commitTime) {
	if (!window._prf) {
		window._prf = [];
	}

	window._prf.push({id, phase, actualDuration, baseDuration, startTime, commitTime});

	if (!putRenderedMark._done) {
		putRenderedMark._done = true;
		window.performance.mark('datePicker-rendered');
	}
}

const DatePickerView = kind({
	name: 'DatePickerView',

	render: () => (
		<Profiler id="datePicker-rendered" onRender={putRenderedMark}>
			<DatePicker value={new Date(2021, 7, 31)} />
		</Profiler>
	)
});

export default DatePickerView;
