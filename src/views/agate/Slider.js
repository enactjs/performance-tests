import Slider from '@enact/agate/Slider';
import kind from '@enact/core/kind';

const SliderView = kind({
	name: 'SliderView',

	render: () => (
		<>
			Slider
			<Slider id="slider" min={0} max={100} defaultValue={0} />
		</>
	)
});

export default SliderView;
