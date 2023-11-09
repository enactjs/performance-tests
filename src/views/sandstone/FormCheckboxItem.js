import kind from '@enact/core/kind';
import {FormCheckboxItem} from '@enact/sandstone/FormCheckboxItem';

const FormCheckboxItemView = kind({
	name: 'FormCheckboxItemView',

	render: () => (
		<FormCheckboxItem id="formCheckboxItem">
			A Checkbox for a form
		</FormCheckboxItem>
	)
});

export default FormCheckboxItemView;
