import qs from 'qs';
import Item from '@enact/sandstone/Item';
import {useLocation} from 'react-router-dom';

const MultipleComponents = () => {
	const arr = [];
	const location = useLocation();
	const search = qs.parse(location.search, {ignoreQueryPrefix: true});
	const count = parseInt(search.count) || 1;

	for (let index = 0; index < count; index++) {
		arr.push(<Item key={index}>Item {index}</Item>);
	}

	return arr;
};

export default MultipleComponents;
