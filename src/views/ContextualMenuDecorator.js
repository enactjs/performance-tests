import kind from '@enact/core/kind';
import Button from "@enact/sandstone/Button";
import ContextualMenuDecorator from '@enact/sandstone/ContextualMenuDecorator';

import {Profiler} from 'react';

function putRenderedMark(id, phase, actualDuration, baseDuration, startTime, commitTime) {
	if (!window._prf) {
		window._prf = [];
	}

	window._prf.push({id, phase, actualDuration, baseDuration, startTime, commitTime});

	if (!putRenderedMark._done) {
		putRenderedMark._done = true;
		window.performance.mark('contextualMenuDecorator-rendered');
	}
}

const ContextualMenuButton = ContextualMenuDecorator(Button);
const popupProps = {
	style: {width: '500px'}
};
const menuItems = ['Item 1', 'Item 2', 'Item 3'];

const ContextualMenuDecoratorView = kind({
	name: 'ContextualMenuDecoratorView',

	render: () => (
		<Profiler id="contextualMenuDecorator-rendered" onRender={putRenderedMark}>
			<ContextualMenuButton
				menuItems={menuItems}
				open
				popupComponent={<div>PopupComponent</div>}
				popupProps={popupProps}
			>
				Button
			</ContextualMenuButton>
		</Profiler>
	)
});

export default ContextualMenuDecoratorView;
