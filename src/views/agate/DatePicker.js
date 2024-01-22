import DatePicker from '@enact/agate/DatePicker';
import kind from '@enact/core/kind';

const DatePickerView = kind({
	name: 'DatePickerView',

	render: () => (
		<DatePicker id="agate-datePicker" />
	)
});

export default DatePickerView;
