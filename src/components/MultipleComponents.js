import qs from 'qs';
import Item from '@enact/moonstone/Item';

const MultipleComponents = ({location}) => {
	const arr = [];
	const search = qs.parse(location.search, {ignoreQueryPrefix: true});
	const count = parseInt(search.count) || 1;

	for (let index = 0; index < count; index++) {
		arr.push(<Item key={index}>Item {index}</Item>);
	}

	return arr;
};

export default MultipleComponents;
