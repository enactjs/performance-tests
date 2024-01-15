import ArcPicker from '@enact/agate/ArcPicker';
import kind from '@enact/core/kind';

const ArcPickerView = kind({
	name: 'ArcPickerView',

	render: () => (
		<>
			ArcPicker
			<ArcPicker id="arcPicker">{[1, 2, 3, 4]}</ArcPicker>
		</>
	)
});

export default ArcPickerView;
