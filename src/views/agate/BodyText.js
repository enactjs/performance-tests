import BodyText from '@enact/agate/BodyText';
import kind from '@enact/core/kind';

const BodyTextView = kind({
	name: 'BodyTextView',

	render: () => (
		<BodyText id="bodyText">
			This is a text on the screen!
		</BodyText>
	)
});

export default BodyTextView;
