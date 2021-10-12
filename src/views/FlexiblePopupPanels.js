import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import Item from '@enact/sandstone/Item';
import {FlexiblePopupPanels, Panel, Header} from '@enact/sandstone/FlexiblePopupPanels';
import qs from "qs";
import {Component} from 'react';

class FlexiblePopupPanelsView extends Component {
	static displayName = 'FlexiblePopupPanelsView';

	constructor(props) {
		super(props);
		const search = qs.parse(props.location.search, {ignoreQueryPrefix: true});

		this.state = {
			open: search.open ? search.open : false
		};

		this.onButtonClick = this.onButtonClick.bind(this);
		this.handleClose = this.handleClose.bind(this);
	};

	onButtonClick() {
		this.setState({open: true})
	};

	handleClose() {
		this.setState({open: false})
	};

	render() {
		return (
			<div>
				<Button id="button" onClick={this.onButtonClick}>Click me</Button>
				<FlexiblePopupPanels
					id="flexiblePopupPanels"
					onClose={this.handleClose}
					open={this.state.open}
					scrimType="none"
				>
					<Panel>
						<Header>
							<title>FlexiblePopupPanels Title</title>
						</Header>
						<BodyText>Example text inside an FlexiblePopupPanels Panel</BodyText>
						<Item>Example Item 1</Item>
						<Item>Example Item 2</Item>
						<Item>Example Item 3</Item>
					</Panel>
				</FlexiblePopupPanels>
			</div>
		);
	};
}

export default FlexiblePopupPanelsView;
