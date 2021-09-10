import kind from '@enact/core/kind';
import Slider from '@enact/sandstone/Slider';
import {Profiler} from 'react';

import {putRenderedMark} from '../utils';

const SliderView = kind({
	name: 'SliderView',

	render: () => (
		<Profiler id="slider-rendered" onRender={putRenderedMark}>
			Slider
			<Slider id="slider" min={0} max={100} defaultValue={0} />
		</Profiler>
	)
});

export default SliderView;
