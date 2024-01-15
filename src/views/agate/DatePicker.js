import kind from '@enact/core/kind';
import DatePicker from '@enact/agate/DatePicker';

const DatePickerView = kind({
	name: 'DatePickerView',

	render: () => (
		<DatePicker id="agate-datePicker" />
	)
});

export default DatePickerView;
