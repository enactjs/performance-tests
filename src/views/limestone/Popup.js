import Button from '@enact/limestone/Button';
import Popup from '@enact/limestone/Popup';
import {useCallback, useState} from 'react';

const PopupView = () => {
	const [open, setOpen] = useState(true);

	const handleToggle = useCallback(() => {
		setOpen(!open);
	}, [open]);

	return (
		<>
			<Button id="button-open" onClick={handleToggle}>open</Button>
			<Popup id="popup" open={open}>
				<Button id="button-close" onClick={handleToggle}>close</Button>
			</Popup>
		</>
	);
};

export default PopupView;
