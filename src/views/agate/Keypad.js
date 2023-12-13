import Keypad from '@enact/agate/Keypad';
import kind from '@enact/core/kind';

const KeypadView = kind({
	name: 'KeypadView',

	render: () => (
		<Keypad id="keypad" />
	)
});

export default KeypadView;
