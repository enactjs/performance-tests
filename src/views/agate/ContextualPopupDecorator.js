import Button from '@enact/agate/Button';
import ContextualPopupDecorator from '@enact/agate/ContextualPopupDecorator';
import {useCallback, useState} from "react";

const ContextualPopupButton = ContextualPopupDecorator(Button);

const popup = () => <h2>Popup</h2>;

const ContextualPopupDecoratorView = () => {
	const [popupOpen, setPopupOpen] = useState(false);

	const handleOpenToggle = useCallback(() => {
		setPopupOpen(!popupOpen);
	}, [popupOpen]);

	return (
		<ContextualPopupButton
			id="agate-contextualPopupDecorator"
			onClose={handleOpenToggle}
			onClick={handleOpenToggle}
			open={popupOpen}
			popupComponent={popup}
		>
			Button
		</ContextualPopupButton>
	);
};

ContextualPopupDecoratorView.displayName = 'ContextualPopupDecoratorView';

export default ContextualPopupDecoratorView;
