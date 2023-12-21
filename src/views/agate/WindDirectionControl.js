import WindDirectionControl from '@enact/agate/WindDirectionControl';
import kind from '@enact/core/kind';

const WindDirectionControlView = kind({
	name: 'WindDirectionControlView',

	render: () => (
		<WindDirectionControl
			id="agate-windDirectionControl"
		/>
	)
});

export default WindDirectionControlView;
