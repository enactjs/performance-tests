import kind from '@enact/core/kind';
import BodyText from '@enact/sandstone/BodyText';

const BodyTextView = kind({
	name: 'BodyTextView',

	render: () => (
		<BodyText id="bodyText">
			This is a text on the screen!
		</BodyText>
	)
});

export default BodyTextView;
