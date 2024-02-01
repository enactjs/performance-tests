import ToggleButton from '@enact/agate/ToggleButton';
import kind from '@enact/core/kind';

const ToggleButtonView = kind({
	name: 'ToggleButtonView',

	render: () => (
		<ToggleButton
			id="agate-togglebutton"
			toggleOffLabel="Off"
			toggleOnLabel="On"
		/>
	)
});

export default ToggleButtonView;
