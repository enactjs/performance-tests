import Scroller from '@enact/agate/Scroller';
import kind from '@enact/core/kind';

const ScrollerView = kind({
	name: 'ScrollerView',

	render: () => (
		<div id="scroller" style={{height: '700px'}}>
			<Scroller focusableScrollbar>
				<div style={{height: '5000px'}}>
					Content
				</div>
			</Scroller>
		</div>
	)
});

export default ScrollerView;
