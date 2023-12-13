import Input from '@enact/agate/Input';
import kind from '@enact/core/kind';

const InputView = kind({
	name: 'InputView',

	render: () => (
		<Input
			id="input"
			defaultValue="Input field"
		/>
	)
});

export default InputView;
