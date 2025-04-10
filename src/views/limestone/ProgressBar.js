import kind from '@enact/core/kind';
import ProgressBar from '@enact/limestone/ProgressBar';

const ProgressBarView = kind({
	name: 'ProgressBar',

	render: () => (
		<ProgressBar id="progressBar" progress={0.3} tooltip />
	)
});

export default ProgressBarView;
