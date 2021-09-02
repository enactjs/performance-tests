import Popup from '@enact/moonstone/Popup';

class PopupView extends React.Component {
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
			<>
				<button id="button-open" onClick={this.handleToggle}>open</button>
				<Popup id="popup" open={this.state.open}>
					<button id="button-close" onClick={this.handleToggle}>close</button>
				</Popup>
			</>
		);
	}
}

export default PopupView;
