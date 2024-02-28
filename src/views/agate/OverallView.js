/* eslint-disable react/jsx-no-bind */

import Button from '@enact/agate/Button';
import CheckboxItem from '@enact/agate/CheckboxItem';
import DatePicker from '@enact/agate/DatePicker';
import {Header} from '@enact/agate/Header';
import ImageItem from '@enact/agate/ImageItem';
import {Panel, TabbedPanels} from '@enact/agate/Panels';
import Scroller from '@enact/agate/Scroller';
import Slider from '@enact/agate/Slider';
import TooltipDecorator from '@enact/agate/TooltipDecorator';
import {VirtualGridList} from '@enact/agate/VirtualList';
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

	const handleOnClick = useCallback(() => {
		setIndex(1);
	}, []);

	const onBeforeTabs = () => {
		setIndex(Math.max(index - 1, 0));
	};
	const onAfterTabs = () => {
		setIndex(Math.min(index + 1, 2));
	};

	const onSelect = (e) => {
		setIndex(e.index);
	};

	return (
		<>
			<TabbedPanels
				index={index}
				noCloseButton
				onSelect={onSelect} // eslint-disable-line react/jsx-no-bind
				orientation="vertical"
				tabs={[
					{title: 'First Tab', icon: 'netbook'},
					{title: 'Second Tab', icon: 'aircirculation'},
					{title: 'Third Tab', icon: 'temperature'}
				]}
			>
				<beforeTabs>
					<Button
						aria-label="Previous Tab"
						icon="arrowlargeleft"
						id="backwardButton"
						onClick={onBeforeTabs} // eslint-disable-line react/jsx-no-bind
						size="small"
						type="grid"
					/>
				</beforeTabs>
				<afterTabs>
					<Button
						aria-label="Next Tab"
						icon="arrowlargeright"
						id="forwardButton"
						onClick={onAfterTabs} // eslint-disable-line react/jsx-no-bind
						size="small"
						type="grid"
					/>
				</afterTabs>
				<Panel>
					<Scroller horizontalScrollbar="hidden">
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
						<div>
							<VirtualGridList
								dataSize={items.length}
								focusableScrollbar
								id="virtualGridList"
								itemRenderer={renderItem}
								itemSize={{
									minWidth: ri.scale(339), // 267px(size of expanded ImageItem) + 36px(for shadow) * 2
									minHeight: ri.scale(339) // 267px(size of expanded ImageItem) + 36px(for shadow) * 2
								}}
								verticalScrollbar="hidden"
							/>
						</div>
					</Scroller>
				</Panel>
				<Panel>
					<Scroller horizontalScrollbar="hidden">
						<Header title="The title of the second tab is very long" type="compact" />
						<DatePicker />
						<div>
							<VirtualGridList
								dataSize={items.length}
								focusableScrollbar
								id="virtualGridListSecond"
								itemRenderer={renderItem}
								itemSize={{
									minWidth: ri.scale(339), // 267px(size of expanded ImageItem) + 36px(for shadow) * 2
									minHeight: ri.scale(339) // 267px(size of expanded ImageItem) + 36px(for shadow) * 2
								}}
								verticalScrollbar="hidden"
							/>
						</div>
					</Scroller>
				</Panel>
				<Panel className="enact-fit">
					<Header title="The title of the third tab is very long" type="compact" />
					<Slider autoFocus defaultValue={50} id="slider" max={100} min={0} />
				</Panel>
			</TabbedPanels>
		</>
	);
};

export default OverallView;
