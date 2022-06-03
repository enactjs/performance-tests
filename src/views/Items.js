import kind from '@enact/core/kind';
import Group from '@enact/ui/Group';
import Item from '@enact/sandstone/Item';
import Scroller from '@enact/sandstone/Scroller';
import PropTypes from 'prop-types';

const items = [];
const url = new URL(window.location.href);

const populateItemsArray = (dataSize) => {
	for (let i = 0; i < dataSize; i++) {
		items.push({children: 'Item ' + ('00' + i).slice(-3), id: 'item', key: i});
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
		dataSize: 20
	},

	render: ({dataSize}) => {
		const urlDataSize = parseInt(url.searchParams.get('dataSize'));
		let dataSizeProp = dataSize;

		if (!isNaN(urlDataSize)) {
			dataSizeProp = parseInt(urlDataSize);
		}

		populateItemsArray(dataSizeProp);

		return (
			<Scroller>
				<Group childComponent={Item} id="items">
					{items}
				</Group>
			</Scroller>
		);
	}
});

export default Items;
