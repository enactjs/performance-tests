import kind from '@enact/core/kind';
import RadioItem from '@enact/limestone/RadioItem';

const RadioItemView = kind({
	name: 'RadioItemView',

	render: () => (
		<RadioItem id="radioItem">
			Hello RadioItem
		</RadioItem>
	)
});

export default RadioItemView;
