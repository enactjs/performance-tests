import kind from '@enact/core/kind';
import Dropdown from '@enact/agate/Dropdown';

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
		<Dropdown id="agate-dropdown" title="Select Item">
			{items}
		</Dropdown>
	)
});

export default DropdownView;
