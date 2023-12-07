import ToggleButton from '@enact/agate/ToggleButton';
import kind from '@enact/core/kind';

const ToggleButtonView = kind({
	name: 'ToggleButtonView',

	render: () => (
		<ToggleButton
			id="agate-togglebutton"
			toggleOnLabel="On"
			toggleOffLabel="Off"
		/>
	)
});

export default ToggleButtonView;
