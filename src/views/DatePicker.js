import kind from '@enact/core/kind';
import DatePicker from '@enact/sandstone/DatePicker';
import {putRenderedMark} from '../utils';

import {Profiler} from 'react';

const DatePickerView = kind({
	name: 'DatePickerView',

	render: () => (
		<Profiler id="datePicker-rendered" onRender={putRenderedMark}>
			<DatePicker value={new Date(2021, 7, 31)} />
		</Profiler>
	)
});

export default DatePickerView;
