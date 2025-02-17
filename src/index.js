import {createRoot} from 'react-dom/client';
import AgateApp from './App/Agate-App.js';
import LimestoneApp from './App/Limestone-App.js';
import SandstoneApp from './App/Sandstone-App.js';

let appElement;

// In a browser environment, render instead of exporting
if (typeof window !== 'undefined') {
	const container = document.getElementById('root');
	const root = createRoot(container);

	import('process').then(() => {
		if (process.env.REACT_APP_ENACT_THEME === 'limestone') {
			appElement = (<LimestoneApp/>);
			root.render(appElement);
		} else if (process.env.REACT_APP_ENACT_THEME === 'sandstone') {
			appElement = (<SandstoneApp />);
			root.render(appElement);
		} else if (process.env.REACT_APP_ENACT_THEME === 'agate') {
			appElement = (<AgateApp />);
			root.render(appElement);
		}
	});
}

export default appElement;
