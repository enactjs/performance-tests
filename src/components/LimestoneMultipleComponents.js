import qs from 'qs';
import Item from '@enact/limestone/Item';
import {useLocation} from 'react-router-dom';

const LimestoneMultipleComponents = () => {
	const arr = [];
	const currentLocation = useLocation();
	const search = qs.parse(currentLocation.search, {ignoreQueryPrefix: true});
	const count = parseInt(search.count) || 1;

	for (let index = 0; index < count; index++) {
		arr.push(<Item key={index}>Item {index}</Item>);
	}

	return arr;
};

export default LimestoneMultipleComponents;
