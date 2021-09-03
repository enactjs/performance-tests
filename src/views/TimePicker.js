import kind from '@enact/core/kind';
import TimePicker from '@enact/sandstone/TimePicker';
import {Profiler} from 'react';

import {putRenderedMark} from '../utils';

const TimePickerView = kind({
	name: 'TimePickerView',

	render: () => (
		<Profiler id="timePicker-rendered" onRender={putRenderedMark}>
			<TimePicker id="timePicker"	/>
		</Profiler>
	)
});

export default TimePickerView;
