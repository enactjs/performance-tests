import kind from '@enact/core/kind';
import Icon from '@enact/sandstone/Icon';
import {putRenderedMark} from '../utils';

import {Profiler} from 'react';

const IconView = kind({
	name: 'IconView',

	render: () => (
		<Profiler id="icon-rendered" onRender={putRenderedMark}>
			<div>Icon</div>
			<Icon id="icon">plus</Icon>
		</Profiler>
	)
});

export default IconView;
