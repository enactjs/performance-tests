import Button from '@enact/agate/Button';
import PopupMenu from '@enact/agate/PopupMenu';
import {useCallback, useState} from 'react';

const PopupMenuView = () => {
	const [open, setOpen] = useState(true);

	const handleToggle = useCallback(() => {
		setOpen(!open);
	}, [open]);

	return (
		<>
			<Button id="button-open" onClick={handleToggle}>open</Button>
			<PopupMenu
				id="popupMenu"
				open={open}
				onClose={handleToggle}
			>
				<Button id="button-close" onClick={handleToggle}>close</Button>
			</PopupMenu>
		</>
	);
};

export default PopupMenuView;
