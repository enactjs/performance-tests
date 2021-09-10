import kind from '@enact/core/kind';
import {FormCheckboxItem} from '@enact/sandstone/FormCheckboxItem';
import {putRenderedMark} from '../utils';

import {Profiler} from 'react';

const FormCheckboxItemView = kind({
	name: 'FormCheckboxItemView',

	render: () => (
		<Profiler id='formCheckboxItem-renderer' onRender={putRenderedMark}>
			<FormCheckboxItem id="formCheckboxItem">
				A Checkbox for a form
			</FormCheckboxItem>
		</Profiler>
	)
});

export default FormCheckboxItemView;
