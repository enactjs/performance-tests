import kind from '@enact/core/kind';
import ProgressButton from '@enact/limestone/ProgressButton';

const ProgressButtonView = kind({
	name: 'ProgressButton',

	render: () => (
		<ProgressButton id="progressButton" progress={0.3} showProgress>Progress Button</ProgressButton>
	)
});

export default ProgressButtonView;
