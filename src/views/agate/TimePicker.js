import TimePicker from '@enact/agate/TimePicker';
import kind from '@enact/core/kind';

const TimePickerView = kind({
	name: 'TimePickerView',

	render: () => (
		<TimePicker id="timePicker" />
	)
});

export default TimePickerView;
