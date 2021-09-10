import kind from '@enact/core/kind';
import RangePicker from '@enact/sandstone/RangePicker';
import {putRenderedMark} from '../utils';

import {Profiler} from 'react';

const RangePickerView = kind({
	name: 'RangePickerView',

	render: () => (
		<Profiler id="rangePicker-rendered" onRender={putRenderedMark}>
			<RangePicker
				id="rangePickerDefault"
				max={100}
				min={0}
				defaultValue={0}
				title="Range Picker Default"
			/>
			<RangePicker
				id="rangePickerJoined"
				max={100}
				min={0}
				defaultValue={0}
				joined
				title="Range Picker Joined"
			/>
		</Profiler>
	)
});

export default RangePickerView;
