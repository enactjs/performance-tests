import LabeledIconButton from '@enact/agate/LabeledIconButton';
import kind from '@enact/core/kind';

const LabeledIconButtonView = kind({
	name: 'LabeledIconButtonView',

	render: () => (
		<LabeledIconButton
			id="labeledIconButton"
			icon="temperature"
		>
			LabeledIconButton
		</LabeledIconButton>
	)
});

export default LabeledIconButtonView;
