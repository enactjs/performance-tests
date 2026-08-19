import kind from '@enact/core/kind';
import ActionGuide from '@enact/limestone/ActionGuide';

const ActionGuideView = kind({
	name: 'ActionGuideView',

	render: () => (
		<ActionGuide id="actionGuide" icon="arrowlargedown">
			Press to continue
		</ActionGuide>
	)
});

export default ActionGuideView;
