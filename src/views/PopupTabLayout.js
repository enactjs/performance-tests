import Button from '@enact/sandstone/Button';
import Item from '@enact/sandstone/Item';
import {Header} from '@enact/sandstone/Panels';
import PopupTabLayout, {Tab, TabPanels, TabPanel} from '@enact/sandstone/PopupTabLayout';
import {useCallback, useState} from 'react';

const PopupTabLayoutView = () => {
	const [index, setIndex] = useState(0);
	const [open, setOpen] = useState(true);

	const handleToggle = useCallback(() => {
		setOpen(!open);
	}, [open, setOpen]);

	return (
		<>
			<Button id="button-open" onClick={handleToggle}>open</Button>
			<PopupTabLayout
				id="popupTabLayout"
				onClose={handleToggle}
				open={open}
			>
				<Tab icon="picture" title="Display">
					<TabPanels
						id="display"
						index={index}
						// eslint-disable-next-line react/jsx-no-bind
						onBack={() => setIndex(0)}
					>
						<TabPanel>
							<Header title="Display Settings" type="compact" />
							<Item>Picture Modes</Item>
							<Item
								id="colorAdjust"
								// eslint-disable-next-line react/jsx-no-bind
								onClick={() => setIndex(1)}
							>
								Color Adjust
							</Item>
						</TabPanel>
						<TabPanel>
							<Header title="Color Adjust" type="compact" />
							<Item>Brightness</Item>
						</TabPanel>
					</TabPanels>
				</Tab>
				<Tab title="Sound">
					<TabPanels
						id="sound"
						index={index}
						noCloseButton
						// eslint-disable-next-line react/jsx-no-bind
						onBack={() => setIndex(0)}
					>
						<TabPanel>
							<Header title="Sound Settings" type="compact" />
							<Item
								id="advancedAudio"
								// eslint-disable-next-line react/jsx-no-bind
								onClick={() => setIndex(1)}
							>
								Advanced Audio</Item>
						</TabPanel>
						<TabPanel>
							<Header title="Advanced Audio Settings" type="compact" />
							<Item>Balance</Item>
							<Item>Fade</Item>
						</TabPanel>
					</TabPanels>
				</Tab>
			</PopupTabLayout>
		</>
	);

};

export default PopupTabLayoutView;
