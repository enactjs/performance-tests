import SliderButton from '@enact/agate/SliderButton';
import kind from '@enact/core/kind';

const threeItems = ['Light Speed', 'Ridiculous Speed', 'Ludicrous Speed'];

const SliderButtonView = kind({
	name: 'SliderButtonView',

	render: () => (
		<SliderButton
			id="sliderButton"
		>
			{threeItems}
		</SliderButton>
	)
});

export default SliderButtonView;
