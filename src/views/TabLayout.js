import kind from '@enact/core/kind';
import Button from '@enact/sandstone/Button';
import Icon from '@enact/sandstone/Icon';
import ImageItem from '@enact/sandstone/ImageItem';
import Item from '@enact/sandstone/Item';
import Scroller from '@enact/sandstone/Scroller';
import TabLayout, {Tab} from '@enact/sandstone/TabLayout';
import {scaleToRem} from '@enact/ui/resolution';
import {Profiler} from 'react';

import {putRenderedMark} from '../utils';

const images = new Array(20).fill().map((_, i) => (
	<ImageItem
		inline
		key={`image${i}`}
		label="ImageItem label"
		src="http://placehold.it/360x240/"
		style={{
			width: scaleToRem(384),
			height: scaleToRem(294)
		}}
	>
		{`ImageItem ${i + 1}`}
	</ImageItem>
));

const TabLayoutView = kind({
	name: 'TabLayoutView',

	render: () => (
		<Profiler id="tabLayout-rendered" onRender={putRenderedMark}>
			<TabLayout id="tabLayout">
				<Tab title="Tab1" id="Tab1">
					<Scroller>{images}</Scroller>
				</Tab>
				<Tab title="Tab2" id="Tab2">
					<Button icon="demosync">Button 1</Button>
					<Button icon="demosync">Button 2</Button>
					<Button icon="demosync">Button 3</Button>
					<Button icon="demosync">Button 4</Button>
					<Button icon="demosync">Button 5</Button>
				</Tab>
				<Tab title="Tab3" id="Tab3">
					<Item slotBefore={<Icon>playcircle</Icon>}>Single Item</Item>
				</Tab>
			</TabLayout>
		</Profiler>
	)
});

export default TabLayoutView;