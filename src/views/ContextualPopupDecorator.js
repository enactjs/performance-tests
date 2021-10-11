import kind from '@enact/core/kind';
import Button from '@enact/sandstone/Button';
import ContextualPopupDecorator from '@enact/sandstone/ContextualPopupDecorator';

const ContextualPopupButton = ContextualPopupDecorator(Button);

const popup = () => <h2>Popup</h2>;

const ContextualPopupDecoratorView = kind({
	name: 'ContextualPopupDecoratorView',

	render: () => (
		<ContextualPopupButton id="contextualPopupDecorator" popupComponent={popup} open>Button</ContextualPopupButton>
	)
});

export default ContextualPopupDecoratorView;
