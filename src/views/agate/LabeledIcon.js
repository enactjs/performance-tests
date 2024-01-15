import LabeledIcon from '@enact/agate/LabeledIcon';
import kind from '@enact/core/kind';

const LabeledIconView = kind({
	name: 'LabeledIconView',

	render: () => (
		<LabeledIcon
			id="labeledIcon"
			icon="temperature"
		>
			LabeledIcon
		</LabeledIcon>
	)
});

export default LabeledIconView;
