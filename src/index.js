import {createRoot} from 'react-dom/client';
import AgateApp from './App/Agate-App.js';
import SandstoneApp from './App/Sandstone-App.js';

let appElement;

// In a browser environment, render instead of exporting
if (typeof window !== 'undefined') {
	const container = document.getElementById('root');
	const root = createRoot(container);

	import('process').then(() => {
		if (process.env.REACT_APP_AGATE !== undefined) {
			appElement = (<AgateApp />)
			root.render(appElement);
		} else {
			appElement = (<SandstoneApp />)
			root.render(appElement);
		}
	});
}

export default appElement;
