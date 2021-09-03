import kind from '@enact/core/kind';
import Steps from '@enact/sandstone/Steps';
import {Profiler} from 'react';

import {putRenderedMark} from '../utils';

const StepsView = kind({
	name: 'StepsView',

	render: () => (
		<Profiler id="steps-rendered" onRender={putRenderedMark}>
			<Steps
				id="steps"
				total={5}
			/>
		</Profiler>
	)
});

export default StepsView;
