import TemperatureControl from '@enact/agate/TemperatureControl';
import kind from '@enact/core/kind';

const TemperatureControlView = kind({
	name: 'TemperatureControlView',

	render: () => (
		<TemperatureControl id="agate-temperatureControl" />
	)
});

export default TemperatureControlView;
