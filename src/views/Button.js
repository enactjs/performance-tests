import kind from '@enact/core/kind';
import Button from '@enact/sandstone/Button';
import {putRenderedMark} from '../utils';

import {Profiler} from 'react';

const ButtonView = kind({
	name: 'ButtonView',

	render: () => (
		<Profiler id="button-rendered" onRender={putRenderedMark}>
			<Button id="button">Hello World!</Button>
		</Profiler>
	)
});

export default ButtonView;
