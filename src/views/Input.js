import kind from '@enact/core/kind';
import Input from '@enact/sandstone/Input';

const InputView = kind({
	name: 'InputView',

	render: () => (
		<Input
			className="inputView"
			placeholder= "placeholder string"
			popupType="overlay"
			size="large"
			subtitle= "Title Below Text"
			title= "Title Text"
		/>
	)
});

export default InputView;
