import ArcSlider from '@enact/agate/ArcSlider';
import kind from '@enact/core/kind';

const ArcSliderView = kind({
	name: 'ArcSliderView',

	render: () => (
		<>
			ArcSlider
			<ArcSlider id="arcSlider" />
		</>
	)
});

export default ArcSliderView;
