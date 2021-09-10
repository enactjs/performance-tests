import kind from '@enact/core/kind';
import FixedPopupPanels from '@enact/sandstone/FixedPopupPanels';
import {putRenderedMark} from '../utils';

import {Profiler} from 'react';

const FixedPopupPanelsView = kind({
	name: 'FixedPopupPanelsView',

	render: () => {
		return (
			<Profiler id="dayPicker-renderer" onRender={putRenderedMark}></Profiler>
		);
	}
});