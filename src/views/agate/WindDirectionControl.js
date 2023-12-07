import kind from '@enact/core/kind';
import WindDirectionControl from '@enact/agate/WindDirectionControl';

const WindDirectionControlView = kind({
	name: 'WindDirectionControlView',

	render: () => (
		<WindDirectionControl
			id="agate-windDirectionControl"
		/>
	)
});

export default WindDirectionControlView;