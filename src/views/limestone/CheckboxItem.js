import kind from '@enact/core/kind';
import CheckboxItem from '@enact/limestone/CheckboxItem';

const CheckboxItemView = kind({
	name: 'CheckboxItemView',

	render: () => (
		<CheckboxItem id="checkboxItem" selected>This is a checkbox item</CheckboxItem>
	)
});

export default CheckboxItemView;
