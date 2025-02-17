/* eslint-disable react/jsx-no-bind */

import Button from '@enact/limestone/Button';
import CheckboxItem from '@enact/limestone/CheckboxItem';
import DatePicker from '@enact/limestone/DatePicker';
import ImageItem from '@enact/limestone/ImageItem';
import {Header} from '@enact/limestone/Panels';
import PopupTabLayout, {Tab, TabPanel, TabPanels} from '@enact/limestone/PopupTabLayout';
import Slider from '@enact/limestone/Slider';
import TooltipDecorator from '@enact/limestone/TooltipDecorator';
import {VirtualGridList} from '@enact/limestone/VirtualList';
import ri from '@enact/ui/resolution';
import PropTypes from 'prop-types';
import {useCallback, useState} from 'react';

const items = [];

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

renderItem.propTypes = {
	index: PropTypes.number
};

for (let i = 0; i < 100; i++) {
	const
		count = ('00' + i).slice(-3),
		caption = `Item ${count}`,
		color = Math.floor((Math.random() * (0x1000000 - 0x101010)) + 0x101010).toString(16),
		label = `SubItem ${count}`,
		src = {
			'hd': `https://placehold.co/200x200/${color}/ffffff/png?text=Image+${i}`,
			'fhd': `https://placehold.co/300x300/${color}/ffffff/png?text=Image+${i}`,
			'uhd': `https://placehold.co/600x600/${color}/ffffff/png?text=Image+${i}`
		};

	items.push({caption, label, src});
}

const TooltipButton = TooltipDecorator({tooltipDestinationProp: 'decoration'}, Button);

const OverallView = () => {
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
						onBack={handleOnBack}
					>
						<TabPanel>
							<Header title="This is a very long header to test Marquee" type="compact" />
							<Slider autoFocus defaultValue={50} id="slider" max={100} min={0} />
							<CheckboxItem id="checkboxItem">This is a checkbox item</CheckboxItem>
							<TooltipButton
								id="tooltipButton"
								onClick={handleOnClick}
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
						onBack={handleOnBack}
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
