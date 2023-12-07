import kind from '@enact/core/kind';
import ThemeDecorator from '@enact/agate/ThemeDecorator';

import Button from '../views/agate/Button';
import Checkbox from '../views/agate/Checkbox';
import ProgressBar from '../views/agate/ProgressBar';
import RadioItem from '../views/agate/RadioItem';
import RangePicker from '../views/agate/RangePicker';
import Scroller from '../views/agate/Scroller';
import Slider from '../views/agate/Slider';
import SliderButton from '../views/agate/SliderButton';
import SwitchItem from '../views/agate/SwitchItem';
import TabGroup from '../views/agate/TabGroup';
import TemperatureControl from '../views/agate/TemperatureControl';
import TimePicker from '../views/agate/TimePicker';
import ThumbnailItem from '../views/agate/ThumbnailItem';
import ToggleButton from '../views/agate/ToggleButton';
import TooltipDecorator from '../views/agate/TooltipDecorator';
import VirtualList from '../views/agate/VirtualList';
import WindDirectionControl from '../views/agate/WindDirectionControl';

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
					<Route path="/checkbox" element={<Checkbox />} />
					<Route path="/progressBar" element={<ProgressBar />} />
					<Route path="/radioItem" element={<RadioItem />} />
					<Route path="/rangePicker" element={<RangePicker />} />
					<Route path="/scroller" element={<Scroller />} />
					<Route path="/slider" element={<Slider />} />
					<Route path="/sliderButton" element={<SliderButton />} />
					<Route path="/switchItem" element={<SwitchItem />} />
					<Route path="/tabGroup" element={<TabGroup />} />
					<Route path="/temperatureControl" element={<TemperatureControl />} />
					<Route path="/thumbnailItem" element={<ThumbnailItem />} />
					<Route path="/timePicker" element={<TimePicker />} />
					<Route path="/toggleButton" element={<ToggleButton />} />
					<Route path="/tooltipDecorator" element={<TooltipDecorator />} />
					<Route path="/virtualList" element={<VirtualList />} />
					<Route path="/windDirectionControl" element={<WindDirectionControl />} />
				</Routes>
			</div>
		</Router>
	)
});

export default ThemeDecorator(AgateApp);
