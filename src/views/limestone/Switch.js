import kind from '@enact/core/kind';
import Switch from '@enact/limestone/Switch';

const SwitchView = kind({
	name: 'SwitchView',

	render: () => (
		<Switch id="switch" />
	)
});

export default SwitchView;
