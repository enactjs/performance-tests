import kind from '@enact/core/kind';
import ThemeDecorator from '@enact/agate/ThemeDecorator';

import Button from '../views/agate/Button';

import css from './App.less';

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

const AgateApp = kind({
	name: 'App',

	styles: {
		css,
		className: 'app'
	},

	render: (props) => (
		<Router>
			<div {...props}>
				<Routes>
					<Route path="/button" element={<Button />} />
				</Routes>
			</div>
		</Router>
	)
});

export default ThemeDecorator(AgateApp);
