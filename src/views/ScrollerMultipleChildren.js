import MultipleComponents from '../components/MultipleComponents';
import ScrollerJS, {ScrollerNative} from '@enact/moonstone/Scroller';
import UiScrollerJS, {ScrollerNative as UiScrollerNative} from '@enact/ui/Scroller';
import qs from 'qs';

const types = {
	ScrollerJS,
	ScrollerNative,
	UiScrollerJS,
	UiScrollerNative
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
