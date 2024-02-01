import LabeledIconButton from '@enact/agate/LabeledIconButton';
import kind from '@enact/core/kind';

const LabeledIconButtonView = kind({
	name: 'LabeledIconButtonView',

	render: () => (
		<LabeledIconButton
			icon="temperature"
			id="labeledIconButton"
		>
			LabeledIconButton
		</LabeledIconButton>
	)
});

export default LabeledIconButtonView;
