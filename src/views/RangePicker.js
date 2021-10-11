import kind from '@enact/core/kind';
import RangePicker from '@enact/sandstone/RangePicker';

const RangePickerView = kind({
	name: 'RangePickerView',

	render: () => (
		<>
			<RangePicker
				id="rangePickerDefault"
				max={100}
				min={0}
				defaultValue={0}
				title="Range Picker Default"
			/>
			<RangePicker
				id="rangePickerJoined"
				max={100}
				min={0}
				defaultValue={0}
				joined
				title="Range Picker Joined"
			/>
		</>
	)
});

export default RangePickerView;
