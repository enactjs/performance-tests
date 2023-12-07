import TabGroup from '@enact/agate/TabGroup';
import kind from '@enact/core/kind';

const TabGroupView = kind({
	name: 'TabGroupView',

	render: () => (
		<TabGroup
			id="tabGroup"
			tabPosition="before"
			tabs={[
				{title: 'Home', icon: 'home'},
				{title: 'Settings', icon: 'setting'},
				{title: 'Theme', icon: 'display'}
			]}
		/>
	)
});

export default TabGroupView;
