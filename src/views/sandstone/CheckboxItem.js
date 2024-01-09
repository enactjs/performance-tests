import kind from '@enact/core/kind';
import CheckboxItem from '@enact/sandstone/CheckboxItem';

const CheckboxItemView = kind({
	name: 'CheckboxItemView',

	render: () => (
		<CheckboxItem id="checkboxItem">This is a checkbox item</CheckboxItem>
	)
});

export default CheckboxItemView;
