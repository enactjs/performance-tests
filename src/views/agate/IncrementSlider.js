import IncrementSlider from '@enact/agate/IncrementSlider';
import kind from '@enact/core/kind';

const IncrementSliderView = kind({
	name: 'IncrementSliderView',

	render: () => (
		<>
			IncrementSlider
			<IncrementSlider id="incrementSlider" />
		</>
	)
});

export default IncrementSliderView;
