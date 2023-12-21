import FanSpeedControl from '@enact/agate/FanSpeedControl';
import kind from '@enact/core/kind';

const FanSpeedControlView = kind({
	name: 'FanSpeedControlView',

	render: () => (
		<FanSpeedControl
			id="fanSpeedControl"
		/>
	)
});

export default FanSpeedControlView;
