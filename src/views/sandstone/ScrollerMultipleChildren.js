import ScrollerJS from '@enact/sandstone/Scroller';
import UiScrollerJS from '@enact/ui/Scroller';
import qs from 'qs';
import {useLocation} from 'react-router-dom';

import SandstoneMultipleComponents from '../../components/SandstoneMultipleComponents';

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
			<SandstoneMultipleComponents location={currentLocation} />
		</Scroller>
	);
};

export default ScrollerMultipleChildren;
export {
	types
};
