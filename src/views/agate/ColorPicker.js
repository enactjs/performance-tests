import ColorPicker from '@enact/agate/ColorPicker';
import kind from '@enact/core/kind';

const colors = ['green', 'yellow', 'orange', 'red', 'black', 'gray', 'white', '#cc5500', 'maroon', 'brown'];

const ColorPickerView = kind({
	name: 'ColorPickerView',

	render: () => (
		<ColorPicker id="agate-colorPicker" defaultExtended open>{colors}</ColorPicker>
	)
});

export default ColorPickerView;
