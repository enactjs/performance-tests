import kind from '@enact/core/kind';
import Checkbox from '@enact/sandstone/Checkbox';
import {putRenderedMark} from '../utils';

import {Profiler} from 'react';

const CheckboxView = kind({
	name: 'CheckboxView',

	render: () => (
		<Profiler id="checkbox-rendered" onRender={putRenderedMark}>
			<Checkbox id="checkbox" />
		</Profiler>
	)
});

export default CheckboxView;
