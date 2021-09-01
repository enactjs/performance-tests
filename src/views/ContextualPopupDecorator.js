import kind from '@enact/core/kind';
import Button from "@enact/sandstone/Button";
import ContextualPopupDecorator from '@enact/sandstone/ContextualPopupDecorator';

import {Profiler} from 'react';

function putRenderedMark(id, phase, actualDuration, baseDuration, startTime, commitTime) {
	if (!window._prf) {
		window._prf = [];
	}

	window._prf.push({id, phase, actualDuration, baseDuration, startTime, commitTime});

	if (!putRenderedMark._done) {
		putRenderedMark._done = true;
		window.performance.mark('contextualPopupDecorator-rendered');
	}
}

const ContextualPopupButton = ContextualPopupDecorator(Button);

const popup = () => <h2>Popup</h2>

const ContextualPopupDecoratorView = kind({
	name: 'ContextualPopupDecoratorView',

	render: () => (
		<Profiler id="contextualPopupDecorator-rendered" onRender={putRenderedMark}>
			<ContextualPopupButton id="contextualPopupDecorator" popupComponent={popup} open>Button</ContextualPopupButton>
		</Profiler>
	)
});

export default ContextualPopupDecoratorView;
