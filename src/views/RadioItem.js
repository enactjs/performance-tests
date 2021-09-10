import kind from '@enact/core/kind';
import RadioItem from '@enact/sandstone/RadioItem';
import {Profiler} from 'react';

import {putRenderedMark} from '../utils';

const RadioItemView = kind({
	name: 'RadioItemView',

	render: () => (
		<Profiler id="radioItem-rendered" onRender={putRenderedMark}>
			<RadioItem id="radioItem">
				Hello RadioItem
			</RadioItem>
		</Profiler>
	)
});

export default RadioItemView;
