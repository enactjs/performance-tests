import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import Icon from '@enact/sandstone/Icon';
import {Image} from '@enact/sandstone/Image';
import Item from '@enact/sandstone/Item';
import {Header, Panel, Panels} from '@enact/sandstone/Panels';
import {Scroller} from '@enact/sandstone/Scroller';
import {TabLayout} from '@enact/sandstone/TabLayout';
import {scale} from '@enact/ui/resolution';
import {useCallback, useState} from 'react';

const PanelsView = () => {
	const [index, setPanelIndex] = useState(0);

	const handleClick = useCallback(() => {
		return index === 0 ? setPanelIndex(1) : setPanelIndex(0);
	}, [index]);

	return (
		<Panels index={index}>
			<Panel id="panel-1" noCloseButton>
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
				<BodyText>Example text inside an Panel Body</BodyText>
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
				<Item>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
					reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
					sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
					est laborum.
				</Item>
			</Panel>
			<Panel noCloseButton onBack={handleClick}>
				<Header id="panel-2-header" title="Panel with TabLayout" />
				<TabLayout>
					<TabLayout.Tab title="Home" icon="home">
						<Icon>home</Icon>Home
						<Scroller style={{height: scale(1000)}}>
							<Image
								caption="Image"
								src="https://placehold.co/360x240/"
								style={{marginTop: '24px'}}
							/>
							<Image
								caption="Image"
								src="https://placehold.co/360x240/"
								style={{marginTop: '24px'}}
							/>
						</Scroller>
					</TabLayout.Tab>
					<TabLayout.Tab title="Button" icon="demosync">
						<Button icon="demosync">Button!</Button>
						<Button icon="demosync">Button!</Button>
						<Button icon="demosync">Button!</Button>
					</TabLayout.Tab>
					<TabLayout.Tab title="Item" icon="playcircle">
						<Item slotBefore={<Icon>playcircle</Icon>}>Hello Item</Item>
					</TabLayout.Tab>
				</TabLayout>
			</Panel>
		</Panels>
	);
};

export default PanelsView;
