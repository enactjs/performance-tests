import kind from '@enact/core/kind';
import DatePicker from '@enact/sandstone/DatePicker';

const DatePickerView = kind({
	name: 'DatePickerView',

	render: () => (
		<DatePicker value={new Date(2021, 7, 31)} />
	)
});

export default DatePickerView;
