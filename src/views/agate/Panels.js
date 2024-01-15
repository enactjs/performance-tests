import Button from '@enact/agate/Button';
import Header from '@enact/agate/Header';
import Item from '@enact/agate/Item';
import {Panel, Panels} from '@enact/agate/Panels';
import TabGroup from "@enact/agate/TabGroup";
import {useCallback, useState} from 'react';

const PanelsView = () => {
	const [index, setPanelIndex] = useState(0);

	const handleClick = useCallback(() => {
		return index === 0 ? setPanelIndex(1) : setPanelIndex(0);
	}, [index]);

	return (
		<Panels index={index} noCloseButton>
			<Panel id="panel-1">
				<Header title="Panel with Items">
					<Button
						icon="arrowlargeright"
						iconFlip="auto"
						id="goToNextPanel"
						onClick={handleClick}
						size="small"
						slot="slotAfter"
					/>
				</Header>
				<Item>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
					reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
					sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
					est laborum.
				</Item>
				<Item>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
					reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
					sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
					est laborum.
				</Item>
			</Panel>
			<Panel onBack={handleClick}>
				<Header id="panel-2-header" title="Panel with TabGroup" >
					<Button
						icon="arrowlargeleft"
						iconFlip="auto"
						id="goToPreviousPanel"
						onClick={handleClick}
						size="small"
						slot="slotBefore"
					/>
				</Header>
				<TabGroup
					id="tabGroup"
					tabPosition="before"
					tabs={[
						{title: 'Home', icon: 'home'},
						{title: 'Settings', icon: 'setting'},
						{title: 'Theme', icon: 'display'}
					]}
				/>
			</Panel>
		</Panels>
	);
};

export default PanelsView;
