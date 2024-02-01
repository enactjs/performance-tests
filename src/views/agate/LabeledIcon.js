import LabeledIcon from '@enact/agate/LabeledIcon';
import kind from '@enact/core/kind';

const LabeledIconView = kind({
	name: 'LabeledIconView',

	render: () => (
		<LabeledIcon
			icon="temperature"
			id="labeledIcon"
		>
			LabeledIcon
		</LabeledIcon>
	)
});

export default LabeledIconView;
