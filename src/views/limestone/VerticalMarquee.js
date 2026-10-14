import kind from '@enact/core/kind';
import VerticalMarquee from '@enact/limestone/VerticalMarquee';

const text = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ';

const VerticalMarqueeView = kind({
	name: 'VerticalMarqueeView',

	render: () => (
		<VerticalMarquee
			id="verticalMarquee"
			marqueeDelay={1}
			marqueeOn="hover"
			style={{width: '600px'}}
		>
			{text.repeat(4)}
		</VerticalMarquee>
	)
});

export default VerticalMarqueeView;
