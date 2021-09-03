import kind from '@enact/core/kind';
import SwitchItem from '@enact/sandstone/SwitchItem';
import {Profiler} from 'react';

import {putRenderedMark} from '../utils';

const SwitchItemView = kind({
	name: 'SwitchItemView',

	render: () => (
		<Profiler id="switchItem-rendered" onRender={putRenderedMark}>
			<SwitchItem id="switchItem">
				Hello SwitchItem
			</SwitchItem>
		</Profiler>
	)
});

export default SwitchItemView;
