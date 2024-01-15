import SwitchItem from '@enact/agate/SwitchItem';
import kind from '@enact/core/kind';

const SwitchItemView = kind({
	name: 'SwitchItemView',

	render: () => (
		<SwitchItem id="switchItem">
			Hello SwitchItem
		</SwitchItem>
	)
});

export default SwitchItemView;
