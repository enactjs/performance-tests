import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import Item from '@enact/sandstone/Item';
import {FlexiblePopupPanels, Panel, Header} from '@enact/sandstone/FlexiblePopupPanels';
import qs from 'qs';
import {useCallback, useState} from 'react';
import {useLocation} from 'react-router-dom';

const FlexiblePopupPanelsView = () => {
	const currentLocation = useLocation();
	const search = qs.parse(currentLocation.search, {ignoreQueryPrefix: true});
	const [open, setOpen] = useState(search.open === 'true');

	const onButtonClick = useCallback(() => {
		setOpen(true);
	}, []);

	const handleClose = useCallback(() => {
		setOpen(false);
	}, []);

	return (
		<div>
			<Button id="button" onClick={onButtonClick}>Click me</Button>
			<FlexiblePopupPanels
				id="flexiblePopupPanels"
				onClose={handleClose}
				open={open}
			>
				<Panel>
					<Header>
						<title>FlexiblePopupPanels Title</title>
					</Header>
					<BodyText>Example text inside an FlexiblePopupPanels Panel</BodyText>
					<Item>Example Item 1</Item>
					<Item>Example Item 2</Item>
					<Item>Example Item 3</Item>
				</Panel>
			</FlexiblePopupPanels>
		</div>
	);
};

export default FlexiblePopupPanelsView;
