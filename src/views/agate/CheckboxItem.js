import CheckboxItem from '@enact/agate/CheckboxItem';
import kind from '@enact/core/kind';

const CheckboxItemView = kind({
	name: 'CheckboxItemView',

	render: () => (
		<CheckboxItem id="agate-checkboxItem" selected>Checkbox Item</CheckboxItem>
	)
});

export default CheckboxItemView;
