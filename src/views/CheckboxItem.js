import kind from '@enact/core/kind';
import CheckboxItem from '@enact/sandstone/CheckboxItem';
import {putRenderedMark} from '../utils';

import {Profiler} from 'react';

const CheckboxItemView = kind({
	name: 'CheckboxItemView',

	render: () => (
		<Profiler id="checkboxItem-rendered" onRender={putRenderedMark}>
			<CheckboxItem id="checkboxItem">This is a checkbox item</CheckboxItem>
		</Profiler>
	)
});

export default CheckboxItemView;
