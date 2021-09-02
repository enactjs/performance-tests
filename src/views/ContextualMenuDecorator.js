import kind from '@enact/core/kind';
import Button from '@enact/sandstone/Button';
import ContextualMenuDecorator from '@enact/sandstone/ContextualMenuDecorator';
import {putRenderedMark} from '../utils';

import {Profiler} from 'react';

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
