import Button from '@enact/agate/Button';
import Drawer from '@enact/agate/Drawer';
import {useCallback, useState} from "react";

const DrawerView = () => {
	const [open, setOpen] = useState(true);

	const handleToggle = useCallback(() => {
		setOpen(!open);
	}, [open]);

	return (
		<>
			<Button id="button-open" onClick={handleToggle}>Open</Button>
			<Drawer id="agate-drawer" open={open}>
				Drawer
				<Button id="button-close" onClick={handleToggle}>Close</Button>
			</Drawer>
		</>
	);
};

export default DrawerView;
