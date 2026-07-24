import kind from '@enact/core/kind';
import ColorPicker from '@enact/limestone/ColorPicker';

const presetColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

const ColorPickerView = kind({
	name: 'ColorPickerView',

	render: () => (
		<ColorPicker
			id="colorPicker"
			color="#FF0000"
			defaultPopupOpen
			presetColors={presetColors}
			text="Color"
		/>
	)
});

export default ColorPickerView;
