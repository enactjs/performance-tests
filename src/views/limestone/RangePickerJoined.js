import kind from '@enact/core/kind';
import RangePicker from '@enact/limestone/RangePicker';

const RangePickerJoinedView = kind({
	name: 'RangePickerJoinedView',

	render: () => (
		<RangePicker
			id="rangePickerJoined"
			max={100}
			min={0}
			defaultValue={0}
			joined
			title="Range Picker Joined"
		/>
	)
});

export default RangePickerJoinedView;
