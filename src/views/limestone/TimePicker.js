import kind from '@enact/core/kind';
import TimePicker from '@enact/limestone/TimePicker';

const TimePickerView = kind({
	name: 'TimePickerView',

	render: () => (
		<TimePicker id="timePicker"	/>
	)
});

export default TimePickerView;
