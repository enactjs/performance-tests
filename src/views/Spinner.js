import kind from '@enact/core/kind';
import Spinner from '@enact/sandstone/Spinner';
import {Profiler} from 'react';

import {putRenderedMark} from '../utils';

const SpinnerView = kind({
	name: 'SpinnerView',

	render: () => (
		<Profiler id="spinner-rendered" onRender={putRenderedMark}>
			<Spinner id="spinner">Loading message...</Spinner>
		</Profiler>
	)
});

export default SpinnerView;
