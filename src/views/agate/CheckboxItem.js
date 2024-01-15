import kind from '@enact/core/kind';
import CheckboxItem from '@enact/agate/CheckboxItem';

const CheckboxItemView = kind({
	name: 'CheckboxItemView',

	render: () => (
		<CheckboxItem id="agate-checkboxItem">Checkbox Item</CheckboxItem>
	)
});

export default CheckboxItemView;
