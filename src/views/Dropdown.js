import kind from '@enact/core/kind';
import Dropdown from '@enact/sandstone/Dropdown';

const items = [
	'Option 1',
	'Option 2',
	'Option 3',
	'Option 4',
	'Option 5'
];

const DropdownView = kind({
	name: 'DropdownView',

	render: () => (
		<Dropdown
			id="dropdown"
			direction="below"
			placeholder="placeholder"
			size="small"
			width="small"
		>
			{items}
		</Dropdown>
	)
});

export default DropdownView;
