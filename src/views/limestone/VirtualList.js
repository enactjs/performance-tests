import kind from '@enact/core/kind';
import Item from '@enact/limestone/Item';
import VirtualList from '@enact/limestone/VirtualList';
import PropTypes from 'prop-types';

const items = [];
const itemSize = 93;
const url = new URL(window.location.href);

const populateItemsArray = (dataSize) => {
	for (let i = 0; i < dataSize; i++) {
		items.push({item: 'Item ' + ('00' + i).slice(-3)});
	}
};

// eslint-disable-next-line enact/prop-types
const renderItem = ({index, ...rest}) => {
	return (
		<Item {...rest}>
			{items[index].item}
		</Item>
	);
};


const VirtualListView = kind({
	name: 'VirtualListView',

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
		let dataSizeProp = dataSize;
		const urlDataSize = parseInt(url.searchParams.get('dataSize'));
		const scrollMode = url.searchParams.get('scrollMode');

		if (!isNaN(urlDataSize)) {
			dataSizeProp = parseInt(urlDataSize);
		}

		populateItemsArray(dataSizeProp);

		return (
			<div style={{height: '700px'}}>
				<VirtualList
					id="VirtualList"
					dataSize={dataSizeProp}
					focusableScrollbar
					itemRenderer={renderItem}
					itemSize={itemSize}
					scrollMode={scrollMode}
				/>
			</div>
		);
	}
});

export default VirtualListView;
