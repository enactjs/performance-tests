import kind from '@enact/core/kind';
import Alert from '@enact/sandstone/Alert';
import Button from '@enact/sandstone/Button';

const AlertView = kind({
	name: 'AlertView',

	render: () => (
		<Alert id="alert" open type="fullscreen">
			<span>
				This is alert Fullscreen.
			</span>
			<buttons>
				<Button id="button">yes</Button>
			</buttons>
		</Alert>
	)
});

export default AlertView;
