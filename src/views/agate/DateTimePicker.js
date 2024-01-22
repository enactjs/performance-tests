import DateTimePicker from '@enact/agate/DateTimePicker';
import kind from '@enact/core/kind';

const DateTimePickerView = kind({
	name: 'DateTimePickerView',

	render: () => (
		<DateTimePicker id="agate-dateTimePicker" />
	)
});

export default DateTimePickerView;
