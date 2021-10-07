import kind from '@enact/core/kind';
import DayPicker from '@enact/sandstone/DayPicker';

const DayPickerView = kind({
	name: 'DayPickerView',

	render: () => (
		<DayPicker id="dayPicker" />
	)
});

export default DayPickerView;
