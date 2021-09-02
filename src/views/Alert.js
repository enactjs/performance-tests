import kind from '@enact/core/kind';
import Alert from '@enact/sandstone/Alert';
import Button from '@enact/sandstone/Button';
import {putRenderedMark} from '../utils';

import {Profiler} from 'react';

const AlertView = kind({
	name: 'AlertView',

	render: () => (
		<Profiler id="alert-rendered" onRender={putRenderedMark}>
			<Alert id="alert" open type="fullscreen">
				<span>
					This is alert Fullscreen.
				</span>
				<buttons>
					<Button id="button">yes</Button>
				</buttons>
			</Alert>
		</Profiler>
	)
});

export default AlertView;
