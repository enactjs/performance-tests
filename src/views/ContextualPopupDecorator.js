import kind from '@enact/core/kind';
import Button from '@enact/sandstone/Button';
import ContextualPopupDecorator from '@enact/sandstone/ContextualPopupDecorator';
import {putRenderedMark} from '../utils';

import {Profiler} from 'react';

const ContextualPopupButton = ContextualPopupDecorator(Button);

const popup = () => <h2>Popup</h2>;

const ContextualPopupDecoratorView = kind({
	name: 'ContextualPopupDecoratorView',

	render: () => (
		<Profiler id="contextualPopupDecorator-rendered" onRender={putRenderedMark}>
			<ContextualPopupButton id="contextualPopupDecorator" popupComponent={popup} open>Button</ContextualPopupButton>
		</Profiler>
	)
});

export default ContextualPopupDecoratorView;
