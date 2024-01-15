import Heading from '@enact/agate/Heading';
import kind from '@enact/core/kind';

const HeadingView = kind({
	name: 'HeadingView',

	render: () => (
		<Heading id="heading" showLine size="title">
			This is a heading!
		</Heading>
	)
});

export default HeadingView;
