import kind from '@enact/core/kind';
import Button from '@enact/limestone/Button';
import Icon from '@enact/limestone/Icon';
import ImageItem from '@enact/limestone/ImageItem';
import Item from '@enact/limestone/Item';
import Scroller from '@enact/limestone/Scroller';
import TabLayout, {Tab} from '@enact/limestone/TabLayout';
import {scaleToRem} from '@enact/ui/resolution';

const images = new Array(20).fill().map((_, i) => (
	<ImageItem
		inline
		key={`image${i}`}
		label="ImageItem label"
		src="https://placehold.co/360x240/"
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
	)
});

export default TabLayoutView;
