import kind from '@enact/core/kind';
import Steps from '@enact/limestone/Steps';

const StepsView = kind({
	name: 'StepsView',

	render: () => (
		<Steps
			id="steps"
			total={5}
		/>
	)
});

export default StepsView;
