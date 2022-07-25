import kind from '@enact/core/kind';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';

import Alert from '../views/Alert';

import css from './App.less';

const App = kind({
	name: 'App',

	styles: {
		css,
		className: 'app'
	},

	render: () => (
		<Alert />
	)
});

export default ThemeDecorator(App);
