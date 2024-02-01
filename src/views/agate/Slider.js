import Slider from '@enact/agate/Slider';
import kind from '@enact/core/kind';

const SliderView = kind({
	name: 'SliderView',

	render: () => (
		<>
			Slider
			<Slider defaultValue={0} id="slider" max={100} min={0} />
		</>
	)
});

export default SliderView;
