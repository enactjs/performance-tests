import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import VerticalMarquee from '@enact/limestone/VerticalMarquee';
import qs from 'qs';
import {useLocation} from 'react-router-dom';

const SpottableVerticalMarquee = Spottable(VerticalMarquee);

const text = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ';

const VerticalMarqueeView = kind({
	name: 'VerticalMarqueeView',

	functional: true,

	render: () => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const currentLocation = useLocation();
		const search = qs.parse(currentLocation.search, {ignoreQueryPrefix: true});
		const marqueeOn = search.marqueeOn || 'hover';
		const marqueeSpeed = search.marqueeSpeed ? Number(search.marqueeSpeed) : 30;

		return (
			<SpottableVerticalMarquee
				id="verticalMarquee"
				marqueeDelay={1}
				marqueeOn={marqueeOn}
				marqueeSpeed={marqueeSpeed}
				style={{width: '600px'}}
			>
				{text.repeat(4)}
			</SpottableVerticalMarquee>
		);
	}
});

export default VerticalMarqueeView;
