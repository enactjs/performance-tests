import kind from '@enact/core/kind';
import Scroller from '@enact/moonstone/Scroller';

const ScrollerView = kind({
	name: 'ScrollerView',

	render: () => (
		<div style={{height: '700px'}}>
			<Scroller id="scroller" focusableScrollbar>
				<div style={{height: '5000px'}} />
			</Scroller>
		</div>
	)
});

export default ScrollerView;
