import kind from '@enact/core/kind';
import DateTimePicker from '@enact/agate/DateTimePicker';

const DateTimePickerView = kind({
	name: 'DateTimePickerView',

	render: () => (
		<DateTimePicker id="agate-dateTimePicker" />
	)
});

export default DateTimePickerView;
