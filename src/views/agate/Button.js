import kind from '@enact/core/kind';
import Button from '@enact/agate/Button';

const ButtonView = kind({
	name: 'ButtonView',

	render: () => (
		<Button id="agate-button">Hello World!</Button>
	)
});

export default ButtonView;
