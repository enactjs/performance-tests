import kind from '@enact/core/kind';
import QuickGuidePanels, {QuickGuidePanel} from '@enact/sandstone/QuickGuidePanels';

const QuickGuidePanelsView = kind({
	name: 'QuickGuidePanelsView',

	render: () => (
		<QuickGuidePanels>
			<QuickGuidePanel>
				<div id="panel-1">View 1</div>
			</QuickGuidePanel>
			<QuickGuidePanel>View 2</QuickGuidePanel>
			<QuickGuidePanel>View 3</QuickGuidePanel>
		</QuickGuidePanels>
	)
});

export default QuickGuidePanelsView;
