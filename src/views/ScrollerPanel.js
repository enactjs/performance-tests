import kind from '@enact/core/kind';
import Scroller from '@enact/sandstone/Scroller';
import {Profiler} from 'react';

import {putRenderedMark} from '../utils';

const ScrollerView = kind({
	name: 'ScrollerView',

	render: () => (
		<Profiler id="scroller-rendered" onRender={putRenderedMark}>
			<div style={{height: '700px'}}>
				<Scroller id="scroller" focusableScrollbar>
					<div style={{height: '5000px'}}>
						Content
					</div>
				</Scroller>
			</div>
		</Profiler>
	)
});

export default ScrollerView;
