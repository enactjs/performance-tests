import kind from '@enact/core/kind';
import VirtualList from '@enact/sandstone/VirtualList';
import Item from '@enact/sandstone/Item';

const items = [];

// eslint-disable-next-line enact/prop-types
const renderItem = ({ ...rest }) => {
	return (
		<Item id="item" {...rest}>Hello Item</Item>
	);
};

for (let i = 0; i < 20; i++) {
	items.push({ item: 'Item ' + ('00' + i).slice(-3) });
}

const itemSize = 60;

const VirtualList20Items = kind({
	name: 'VirtualList20Items',

	render: () => (
		<div style={{ height: '700px' }}>
			<VirtualList
				id="virtualList"
				dataSize={items.length}
				focusableScrollbar
				itemRenderer={renderItem}
				itemSize={itemSize}
			/>
		</div>
	)
});

export default VirtualList20Items;
