import kind from '@enact/core/kind';
import Group from '@enact/ui/Group';
import Item from '@enact/sandstone/Item';
import Scroller from '@enact/sandstone/Scroller';
import PropTypes from 'prop-types';

const items = [];
const url = new URL(window.location.href);

const populateItemsArray = (dataSize) => {
	for (let i = 0; i < dataSize; i++) {
		items.push({children: 'Item ' + ('00' + i).slice(-3), key: i});
	}
};

const Items = kind({
	name: 'Items',

	propTypes: {
		/**
		*  Number of items in the VirtualList
		*/
		dataSize: PropTypes.number
	},

	defaultProps: {
		dataSize: 100
	},

	render: ({dataSize}) => {
		const urlDataSize = parseInt(url.searchParams.get('dataSize'));
		const dataSizeProp = urlDataSize  || dataSize;
		populateItemsArray(dataSizeProp);

		return (
			<Scroller style={{height: '700px'}}>
				<Group childComponent={Item} id="Items">
					{items}
				</Group>
			</Scroller>
		);
	}
});

export default Items;
