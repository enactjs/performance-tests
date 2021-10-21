import kind from '@enact/core/kind';
import Switch from '@enact/sandstone/Switch';

const SwitchView = kind({
	name: 'SwitchView',

	render: () => (
		<Switch id="switch" />
	)
});

export default SwitchView;
