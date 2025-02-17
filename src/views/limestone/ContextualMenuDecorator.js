import kind from '@enact/core/kind';
import Button from '@enact/limestone/Button';
import ContextualMenuDecorator from '@enact/limestone/ContextualMenuDecorator';

const ContextualMenuButton = ContextualMenuDecorator(Button);
const popupProps = {
	style: {width: '500px'}
};
const menuItems = ['Item 1', 'Item 2', 'Item 3'];

const ContextualMenuDecoratorView = kind({
	name: 'ContextualMenuDecoratorView',

	render: () => (
		<ContextualMenuButton
			menuItems={menuItems}
			open
			popupComponent={<div>PopupComponent</div>}
			popupProps={popupProps}
		>
			Button
		</ContextualMenuButton>
	)
});

export default ContextualMenuDecoratorView;
