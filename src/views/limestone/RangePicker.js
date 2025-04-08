import kind from '@enact/core/kind';
import RangePicker from '@enact/limestone/RangePicker';

const RangePickerView = kind({
	name: 'RangePickerView',

	render: () => (
		<RangePicker
			id="rangePickerDefault"
			max={100}
			min={0}
			defaultValue={0}
			title="Range Picker Default"
		/>
	)
});

export default RangePickerView;
