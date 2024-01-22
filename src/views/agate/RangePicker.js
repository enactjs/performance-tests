import RangePicker from '@enact/agate/RangePicker';
import kind from '@enact/core/kind';

const RangePickerView = kind({
	name: 'RangePickerView',

	render: () => (
		<RangePicker
			defaultValue={0}
			id="rangePicker"
			max={100}
			min={0}
			title="Range Picker"
		/>
	)
});

export default RangePickerView;
