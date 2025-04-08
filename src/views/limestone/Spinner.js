import kind from '@enact/core/kind';
import Spinner from '@enact/limestone/Spinner';

const SpinnerView = kind({
	name: 'SpinnerView',

	render: () => (
		<Spinner id="spinner">Loading message...</Spinner>
	)
});

export default SpinnerView;
