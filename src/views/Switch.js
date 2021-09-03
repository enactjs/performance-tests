import kind from '@enact/core/kind';
import Switch from '@enact/sandstone/Switch';
import {Profiler} from 'react';

import {putRenderedMark} from '../utils';

const SwitchView = kind({
	name: 'SwitchView',

	render: () => (
		<Profiler id="switch-rendered" onRender={putRenderedMark}>
			<Switch id="switch">
				Hello Switch
			</Switch>
		</Profiler>
	)
});

export default SwitchView;
