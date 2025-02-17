import ScrollerJS from '@enact/limestone/Scroller';
import UiScrollerJS from '@enact/ui/Scroller';
import qs from 'qs';
import {useLocation} from 'react-router-dom';

import LimestoneMultipleComponents from '../../components/LimestoneMultipleComponents';

const types = {
	ScrollerJS,
	UiScrollerJS
};

const ScrollerMultipleChildren = () => {
	const currentLocation = useLocation();
	const search = qs.parse(currentLocation.search, {ignoreQueryPrefix: true});
	const type = search.type;
	const Scroller = types[type] || ScrollerJS;

	return (
		<Scroller id="Scroller">
			<LimestoneMultipleComponents location={currentLocation} />
		</Scroller>
	);
};

export default ScrollerMultipleChildren;
export {
	types
};
