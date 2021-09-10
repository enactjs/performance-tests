import Button from '@enact/sandstone/Button';
import Popup from '@enact/sandstone/Popup';
import {putRenderedMark} from '../utils';

import {Component, Profiler} from 'react';

class PopupView extends Component {
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
		<Profiler id="popup-rendered" onRender={putRenderedMark}>
			<Button id="button-open" onClick={this.handleToggle}>open</Button>
			<Popup id="popup" open={this.state.open}>
				<Button id="button-close" onClick={this.handleToggle}>close</Button>
			</Popup>
		</Profiler>
		);
	}
}

export default PopupView;
