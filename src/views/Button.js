import kind from '@enact/core/kind';
import Button from '@enact/sandstone/Button';

const ButtonView = kind({
	name: 'ButtonView',

	render: () => (
		<Button id="button">Hello World!</Button>
	)
});

export default ButtonView;
