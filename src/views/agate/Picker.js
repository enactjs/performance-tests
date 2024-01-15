import Picker from '@enact/agate/Picker';
import kind from '@enact/core/kind';

const pickerList = [
	'Apple',
	'Banana',
	'Clementine',
	'Durian'
];

const PickerView = kind({
	name: 'PickerView',

	render: () => (
		<Picker id="picker" title="Picker Default" >{pickerList}</Picker>
	)
});

export default PickerView;
