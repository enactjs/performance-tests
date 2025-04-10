import BodyText from '@enact/limestone/BodyText';
import Button from '@enact/limestone/Button';
import Item from '@enact/limestone/Item';
import {FixedPopupPanels, Panel, Header} from '@enact/limestone/FixedPopupPanels';
import qs from 'qs';
import {useCallback, useState} from 'react';
import {useLocation} from 'react-router-dom';

const FixedPopupPanelsView = () => {
	const currentLocation = useLocation();
	const search = qs.parse(currentLocation.search, {ignoreQueryPrefix: true});
	const [open, setOpen] = useState(search.open === 'true');

	const onButtonClick = useCallback(() => {
		setOpen(true);
	}, []);

	return (
		<>
			<Button id="button" onClick={onButtonClick}>Click me</Button>
			<FixedPopupPanels
				id="fixedPopupPanels"
				open={open}
			>
				<Panel>
					<Header>
						<title>FixedPopupPanels Title</title>
						<subtitle>A panel type for options views</subtitle>
					</Header>
					<BodyText>Example text inside an FixedPopupPanels Panel</BodyText>
					<Item>Example Item 1</Item>
					<Item>Example Item 2</Item>
					<Item>Example Item 3</Item>
				</Panel>
				<Panel>
					<Header>
						<title>Another Panel</title>
						<subtitle>This is the second page</subtitle>
					</Header>
					<BodyText>Woo woo</BodyText>
					<Item>Example Item 1 on Panel 2</Item>
					<Item>Example Item 2 on Panel 2</Item>
					<Item>Example Item 3 on Panel 2</Item>
				</Panel>
			</FixedPopupPanels>
		</>
	);
};

export default FixedPopupPanelsView;
