import kind from '@enact/core/kind';
import Slider from '@enact/moonstone/Slider';

const SliderView = kind({
	name: 'SliderView',

	render: () => (
		<Slider id="slider" min={0} max={100} defaultValue={0} />
	)
});

export default SliderView;
