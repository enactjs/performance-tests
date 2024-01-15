import ProgressBar from '@enact/agate/ProgressBar';
import kind from '@enact/core/kind';

const ProgressBarView = kind({
	name: 'ProgressBar',

	render: () => (
		<>
			<div style={{height:'100px'}} />
			<ProgressBar id="progressBar" progress={0.3} tooltip />
		</>
	)
});

export default ProgressBarView;
