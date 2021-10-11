import kind from '@enact/core/kind';
import Checkbox from '@enact/sandstone/Checkbox';

const CheckboxView = kind({
	name: 'CheckboxView',

	render: () => (
		<Checkbox id="checkbox" />
	)
});

export default CheckboxView;
