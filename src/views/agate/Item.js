import Item from '@enact/agate/Item';
import kind from '@enact/core/kind';

const ItemView = kind({
	name: 'ItemView',

	render: () => (
		<Item id="item">
			Hello Item
		</Item>
	)
});

export default ItemView;
