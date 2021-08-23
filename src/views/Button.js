import kind from '@enact/core/kind';
import Button from '@enact/sandstone/Button';

import React, {Profiler} from 'react';

function putRenderedMark(id, phase, actualDuration, baseDuration, startTime, commitTime) {
	if (!putRenderedMark._done) {
		putRenderedMark._done = true;
		window.performance.mark('button-rendered');
	}

	console.log(
		`id: ${id}, 
		phase: ${phase}, 
		actualDuration: ${actualDuration}, 
		baseDuration: ${baseDuration}, 
		startTime: ${startTime}, 
		commitTime: ${commitTime}`
	);
}

const ButtonView = kind({
	name: 'ButtonView',

	render: () => (
		<Profiler id="button-rendered" onRender={putRenderedMark}>
			<Button id="button">Hello World!</Button>
		</Profiler>
	)
});

export default ButtonView;
