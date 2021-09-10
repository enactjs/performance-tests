import kind from '@enact/core/kind';
import Item from '@enact/sandstone/Item';
import {putRenderedMark} from '../utils';

import {Profiler} from 'react';

const ItemView = kind({
	name: 'ItemView',

	render: () => (
		<Profiler id="item-rendered" onRender={putRenderedMark}>
			<Item id="item">Hello Item</Item>
		</Profiler>
	)
});

export default ItemView;
