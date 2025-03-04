import Button from '@enact/limestone/Button';
import Item from '@enact/limestone/Item';
import {Header} from '@enact/limestone/Panels';
import PopupTabLayout, {Tab, TabPanels, TabPanel} from '@enact/limestone/PopupTabLayout';
import {useCallback, useState} from 'react';

const PopupTabLayoutView = () => {
	const [index, setIndex] = useState(0);
	const [open, setOpen] = useState(true);

	const handleToggle = useCallback(() => {
		setOpen(!open);
	}, [open]);

	const handleOnBack = useCallback(() => {
		setIndex(0);
	}, []);

	const handleOnClick = useCallback(() => {
		setIndex(1);
	}, []);

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
						onBack={handleOnBack}
					>
						<TabPanel>
							<Header title="Display Settings" type="compact" />
							<Item>Picture Modes</Item>
							<Item
								id="colorAdjust"
								onClick={handleOnClick}
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
						onBack={handleOnBack}
					>
						<TabPanel>
							<Header title="Sound Settings" type="compact" />
							<Item
								id="advancedAudio"
								onClick={handleOnClick}
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
