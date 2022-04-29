/* eslint-disable react/jsx-no-bind */

import Button from '@enact/sandstone/Button';
import CheckboxItem from '@enact/sandstone/CheckboxItem';
import DatePicker from '@enact/sandstone/DatePicker';
import ImageItem from '@enact/sandstone/ImageItem';
import {Header} from '@enact/sandstone/Panels';
import PopupTabLayout, {Tab, TabPanel, TabPanels} from '@enact/sandstone/PopupTabLayout';
import Slider from '@enact/sandstone/Slider';
import TooltipDecorator from '@enact/sandstone/TooltipDecorator';
import {VirtualGridList} from '@enact/sandstone/VirtualList';
import ri from '@enact/ui/resolution';
import {useState} from 'react';

const items = [];
// eslint-disable-next-line enact/prop-types
const renderItem = ({index, ...rest}) => {
	const {caption, label, src} = items[index];

	return (
		<ImageItem
			{...rest}
			label={label}
			src={src}
		>
			{caption}
		</ImageItem>
	);
};

for (let i = 0; i < 100; i++) {
	const
		count = ('00' + i).slice(-3),
		caption = `Item ${count}`,
		color = Math.floor((Math.random() * (0x1000000 - 0x101010)) + 0x101010).toString(16),
		label = `SubItem ${count}`,
		src = {
			'hd': `http://via.placeholder.com/200x200/${color}/ffffff/png?text=Image+${i}`,
			'fhd': `http://via.placeholder.com/300x300/${color}/ffffff/png?text=Image+${i}`,
			'uhd': `http://via.placeholder.com/600x600/${color}/ffffff/png?text=Image+${i}`
		};

	items.push({caption, label, src});
}

const TooltipButton = TooltipDecorator({tooltipDestinationProp: 'decoration'}, Button);

const OverallView = () => {
	const [index, setIndex] = useState(0);
	const [open, setOpen] = useState(true);

	function handleToggle () {
		setOpen(!open);
	}

	return (
		<>
			<PopupTabLayout
				id="popupTabLayout"
				noAutoDismiss
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
							<Header title="This is a very long header to test Marquee" type="compact" />
							<Slider autoFocus defaultValue={50} id="slider" max={100} min={0} />
							<CheckboxItem id="checkboxItem">This is a checkbox item</CheckboxItem>
							<TooltipButton
								id="tooltipButton"
								// eslint-disable-next-line react/jsx-no-bind
								onClick={() => setIndex(1)}
								tooltipText="tooltip!"
							>
								Next Panel
							</TooltipButton>
							<VirtualGridList
								dataSize={items.length}
								focusableScrollbar
								id="virtualGridList"
								itemRenderer={renderItem}
								itemSize={{
									minWidth: ri.scale(339), // 267px(size of expanded ImageItem) + 36px(for shadow) * 2
									minHeight: ri.scale(339) // 267px(size of expanded ImageItem) + 36px(for shadow) * 2
								}}
								verticalScrollbar="visible"
							/>
						</TabPanel>
						<TabPanel>
							<Header title="Color Adjust Color Adjust Color Adjust Color Adjust" type="compact" />
							<DatePicker />
							<VirtualGridList
								dataSize={items.length}
								focusableScrollbar
								id="virtualGridListSecond"
								itemRenderer={renderItem}
								itemSize={{
									minWidth: ri.scale(339), // 267px(size of expanded ImageItem) + 36px(for shadow) * 2
									minHeight: ri.scale(339) // 267px(size of expanded ImageItem) + 36px(for shadow) * 2
								}}
								verticalScrollbar="visible"
							/>
						</TabPanel>
					</TabPanels>
				</Tab>
				<Tab icon="sound" title="Sound">
					<TabPanels
						id="sound"
						index={0}
						// eslint-disable-next-line react/jsx-no-bind
						onBack={() => setIndex(0)}
					>
						<TabPanel>
							<Header title="The title of the second tab is very long" type="compact" />
							<Slider autoFocus defaultValue={50} id="slider" max={100} min={0} />
						</TabPanel>
					</TabPanels>
				</Tab>
			</PopupTabLayout>
		</>
	);
};

export default OverallView;
