import Input from '@enact/agate/Input';
import kind from '@enact/core/kind';

const InputView = kind({
	name: 'InputView',

	render: () => (
		<Input
			defaultValue="Input field"
			id="input"
		/>
	)
});

export default InputView;
