import ScrollerJS from '@enact/sandstone/Scroller';
import UiScrollerJS from '@enact/ui/Scroller';
import qs from 'qs';
import {Profiler} from 'react';

import MultipleComponents from '../components/MultipleComponents';
import {putRenderedMark} from '../utils';

const types = {
	ScrollerJS,
	UiScrollerJS
};

const ScrollerMultipleChildren = ({location}) => {
	const search = qs.parse(location.search, {ignoreQueryPrefix: true});
	const type = search.type;
	const Scroller = types[type] || ScrollerJS;

	return (
		<Profiler id="scroller-rendered" onRender={putRenderedMark}>
			<Scroller id="Scroller" animate>
				<MultipleComponents location={location} />
			</Scroller>
		</Profiler>
	);
};

export default ScrollerMultipleChildren;
export {
	types
};
