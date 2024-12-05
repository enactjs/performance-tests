import kind from '@enact/core/kind';
import ColorPicker from '@enact/sandstone/ColorPickerPOC';

const colors = ['#eb4034', '#32a852', '#3455eb'];

const ColorPickerView = kind({
	name: 'ColorPickerView',

	render: () => (
		<ColorPicker
			id="colorPicker"
			color={colors[0]}
			colors={colors}
			onChangeColor={() => {}} // eslint-disable-line react/jsx-no-bind
			open
		/>
	)
});

export default ColorPickerView;
