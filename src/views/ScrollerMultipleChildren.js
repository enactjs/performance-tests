import ScrollerJS from '@enact/sandstone/Scroller';
import UiScrollerJS from '@enact/ui/Scroller';
import qs from 'qs';

import MultipleComponents from '../components/MultipleComponents';

const types = {
	ScrollerJS,
	UiScrollerJS
};

const ScrollerMultipleChildren = ({location}) => {
	const search = qs.parse(location.search, {ignoreQueryPrefix: true});
	const type = search.type;
	const Scroller = types[type] || ScrollerJS;

	return (
		<Scroller id="Scroller" animate>
			<MultipleComponents location={location} />
		</Scroller>
	);
};

export default ScrollerMultipleChildren;
export {
	types
};
