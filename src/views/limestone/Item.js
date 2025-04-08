import kind from '@enact/core/kind';
import Item from '@enact/limestone/Item';

const ItemView = kind({
	name: 'ItemView',

	render: () => (
		<Item id="item">Hello Item</Item>
	)
});

export default ItemView;
