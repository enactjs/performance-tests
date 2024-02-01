import RadioItem from '@enact/agate/RadioItem';
import kind from '@enact/core/kind';

const RadioItemView = kind({
	name: 'RadioItemView',

	render: () => (
		<RadioItem id="radioItem">
			Hello RadioItem
		</RadioItem>
	)
});

export default RadioItemView;
