import kind from '@enact/core/kind';
import DayPicker from '@enact/sandstone/DayPicker';
import {putRenderedMark} from '../utils';

import {Profiler} from 'react';

const DayPickerView = kind({
	name: 'DayPickerView',

	render: () => (
		<Profiler id="dayPicker-renderer" onRender={putRenderedMark}>
			<DayPicker id="dayPicker" />
		</Profiler>
	)
});

export default DayPickerView;
