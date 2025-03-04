import kind from '@enact/core/kind';
import Heading from '@enact/limestone/Heading';

const HeadingView = kind({
	name: 'HeadingView',

	render: () => (
		<Heading id="heading" showLine>
			This is a heading!
		</Heading>
	)
});

export default HeadingView;
