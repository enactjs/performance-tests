import kind from '@enact/core/kind';
import QuickGuidePanels, {Panel} from '@enact/sandstone/QuickGuidePanels';

const QuickGuidePanelsView = kind({
	name: 'IconItemView',

	render: () => (
		<QuickGuidePanels>
			<Panel>
				<div id="panel-1">View 1</div>
			</Panel>
			<Panel>View 2</Panel>
			<Panel>View 3</Panel>
		</QuickGuidePanels>
	)
});

export default QuickGuidePanelsView;
