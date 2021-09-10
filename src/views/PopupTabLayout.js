import Button from '@enact/sandstone/Button';
import Item from '@enact/sandstone/Item';
import {Header} from '@enact/sandstone/Panels'
import PopupTabLayout, {Tab, TabPanels, TabPanel} from '@enact/sandstone/PopupTabLayout';
import Group from '@enact/ui/Group';
import {putRenderedMark} from '../utils';

import {Component, Profiler} from 'react';

class PopupTabLayoutView extends Component {
	constructor (props) {
		super(props);

		this.state = {
			open: true
		};
	}

	handleToggle = () => {
		this.setState(({open}) => ({open: !open}));
	};

	render () {
		return (
		<Profiler id="PopupTabLayout-rendered" onRender={putRenderedMark}>
			<Button id="button-open" onClick={this.handleToggle}>open</Button>
			<PopupTabLayout id="PopupTabLayout" open={this.state.open}>
				<Tab title="Display">
					<TabPanels index={1} onBack={this.handleToggle}>
						<TabPanel>
							<Header title="Display Settings" type="compact" />
							<Item>Picture Modes</Item>
							<Item>Color Adjust</Item>
						</TabPanel>
						<TabPanel>
							<Header title="Advanced Audio Settings" type="compact" />
							<Group childComponent={Item} component="div" select="radio" selectedProp="selected">
								{['Balance', 'Fade']}
							</Group>
						</TabPanel>
					</TabPanels>
				</Tab>
			</PopupTabLayout>
		</Profiler>
		);
	}
}

export default PopupTabLayoutView;
