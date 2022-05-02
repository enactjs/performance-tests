/* eslint-disable react/jsx-no-bind */

import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import Item from '@enact/sandstone/Item';
import {FlexiblePopupPanels, Panel, Header} from '@enact/sandstone/FlexiblePopupPanels';
import qs from 'qs';
import {useCallback, useState} from 'react';

const FlexiblePopupPanelsView = (props) => {
	const search = qs.parse(props.location.search, {ignoreQueryPrefix: true});
	const [open, setOpen] = useState(search.open === 'true');

	const onButtonClick = useCallback(() => {
		setOpen(true);
	}, [setOpen]);

	const handleClose = useCallback(() => {
		setOpen({open: false});
	}, [setOpen]);

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
