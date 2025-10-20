import kind from '@enact/core/kind';
import Checkbox from '@enact/agate/Checkbox';

const CheckboxView = kind({
	name: 'CheckboxView',

	render: () => (
		<Checkbox id="agate-checkbox" selected />
	)
});

export default CheckboxView;
