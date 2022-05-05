import kind from '@enact/core/kind';
import Slider from '@enact/sandstone/Slider';

const SliderView = kind({
	name: 'SliderView',

	render: () => (
		<>
			Horizontal Slider
			<Slider id="horizontalSlider" min={0} max={100} defaultValue={0} tooltip />
			VerticalSlider
			<Slider id="verticalSlider" min={0} max={100} defaultValue={0} tooltip orientation="vertical" />
		</>
	)
});

export default SliderView;
