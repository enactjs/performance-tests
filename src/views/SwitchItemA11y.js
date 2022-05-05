import kind from '@enact/core/kind';
import SwitchItem from '@enact/sandstone/SwitchItem';

const SwitchItemView = kind({
	name: 'SwitchItemView',

	render: () => (
		<SwitchItem id="switchItem">
			Hello SwitchItem
		</SwitchItem>
	)
});

export default SwitchItemView;
