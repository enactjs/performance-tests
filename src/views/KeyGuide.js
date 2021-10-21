import kind from '@enact/core/kind';
import KeyGuide from '@enact/sandstone/KeyGuide';

const KeyGuideView = kind({
	name: 'KeyGuideView',

	render: () => (
		<KeyGuide
			id="keyGuide"
			open
		>
			{[{icon: 'plus', children: 'This is long name item', key: 1}, {icon: 'minus', children: 'Item 2', key: 2}, {icon: 'music', children: 'Item 3', key: 3}]}
		</KeyGuide>
	)
});

export default KeyGuideView;
