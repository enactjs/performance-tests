import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import Item from '@enact/sandstone/Item';
import {FixedPopupPanels, Panel, Header} from '@enact/sandstone/FixedPopupPanels';
import {Component} from 'react';

class FixedPopupPanelsView extends Component {
	static displayName = 'FixedPopupPanelsView';

	constructor(props) {
		super(props);
		this.state = {
			open: false
		};

		this.onButtonClick = this.onButtonClick.bind(this);
	};

	onButtonClick() {
		this.setState({open: true})
	};

	render() {
		return (
			<div>
				<Button id="button" onClick={this.onButtonClick}>Click me</Button>
				<FixedPopupPanels
					id="fixedPopupPanels"
					open={this.state.open}
					scrimType="none"
				>
					<Panel>
						<Header>
							<title>FixedPopupPanels Title</title>
							<subtitle>A panel type for options views</subtitle>
						</Header>
						<BodyText>Example text inside an FixedPopupPanels Panel</BodyText>
						<Item>Example Item 1</Item>
						<Item>Example Item 2</Item>
						<Item>Example Item 3</Item>
					</Panel>
					<Panel>
						<Header>
							<title>Another Panel</title>
							<subtitle>This is the second page</subtitle>
						</Header>
						<BodyText>Woo woo</BodyText>
						<Item>Example Item 1 on Panel 2</Item>
						<Item>Example Item 2 on Panel 2</Item>
						<Item>Example Item 3 on Panel 2</Item>
					</Panel>
				</FixedPopupPanels>
			</div>
		);
	};
}

export default FixedPopupPanelsView;
