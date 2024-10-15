import kind from '@enact/core/kind';
import ThemeDecorator from '@enact/agate/ThemeDecorator';

import ArcPicker from '../views/agate/ArcPicker';
import ArcSlider from '../views/agate/ArcSlider';
import BodyText from '../views/agate/BodyText';
import Button from '../views/agate/Button';
import Checkbox from '../views/agate/Checkbox';
import CheckboxItem from '../views/agate/CheckboxItem';
import ColorPicker from '../views/agate/ColorPicker';
import ContextualPopupDecorator from '../views/agate/ContextualPopupDecorator';
import DatePicker from '../views/agate/DatePicker';
import DateTimePicker from '../views/agate/DateTimePicker';
import Drawer from '../views/agate/Drawer';
import Dropdown from '../views/agate/Dropdown';
import FanSpeedControl from "../views/agate/FanSpeedControl";
import Header from "../views/agate/Header";
import Heading from "../views/agate/Heading";
import Icon from "../views/agate/Icon";
import Image from "../views/agate/Image";
import ImageItem from "../views/agate/ImageItem";
import IncrementSlider from '../views/agate/IncrementSlider';
import Input from '../views/agate/Input';
import Item from '../views/agate/Item';
import Keypad from '../views/agate/Keypad';
import LabeledIcon from '../views/agate/LabeledIcon';
import LabeledIconButton from '../views/agate/LabeledIconButton';
import Marquee from '../views/agate/Marquee';
import MediaPlayer from '../views/agate/MediaPlayer';
import OverallView from '../views/agate/OverallView';
import Panels from '../views/agate/Panels';
import Picker from '../views/agate/Picker';
import Popup from "../views/agate/Popup";
import PopupMenu from "../views/agate/PopupMenu";
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
import VirtualListNative from '../views/agate/VirtualListNative';
import VirtualListTranslate from '../views/agate/VirtualListTranslate';
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
					<Route path="/arcPicker" element={<ArcPicker />} />
					<Route path="/arcSlider" element={<ArcSlider />} />
					<Route path="/bodyText" element={<BodyText />} />
					<Route path="/button" element={<Button />} />
					<Route path="/checkbox" element={<Checkbox />} />
					<Route path="/checkboxItem" element={<CheckboxItem />} />
					<Route path="/colorPicker" element={<ColorPicker />} />
					<Route path="/contextualPopupDecorator" element={<ContextualPopupDecorator />} />
					<Route path="/datePicker" element={<DatePicker />} />
					<Route path="/dateTimePicker" element={<DateTimePicker />} />
					<Route path="/drawer" element={<Drawer />} />
					<Route path="/dropdown" element={<Dropdown />} />
					<Route path="/fanSpeedControl" element={<FanSpeedControl />} />
					<Route path="/header" element={<Header />} />
					<Route path="/heading" element={<Heading />} />
					<Route path="/icon" element={<Icon />} />
					<Route path="/image" element={<Image />} />
					<Route path="/imageItem" element={<ImageItem />} />
					<Route path="/incrementSlider" element={<IncrementSlider />} />
					<Route path="/input" element={<Input />} />
					<Route path="/item" element={<Item />} />
					<Route path="/keypad" element={<Keypad />} />
					<Route path="/labeledIcon" element={<LabeledIcon />} />
					<Route path="/labeledIconButton" element={<LabeledIconButton />} />
					<Route path="/marquee" element={<Marquee />} />
					<Route path="/mediaPlayer" element={<MediaPlayer />} />
					<Route path="/overallView" element={<OverallView />} />
					<Route path="/panels" element={<Panels />} />
					<Route path="/picker" element={<Picker />} />
					<Route path="/popup" element={<Popup />} />
					<Route path="/popupMenu" element={<PopupMenu />} />
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
					<Route path="/virtualListNative" element={<VirtualListNative />} />
					<Route path="/virtualListTranslate" element={<VirtualListTranslate />} />
					<Route path="/windDirectionControl" element={<WindDirectionControl />} />
				</Routes>
			</div>
		</Router>
	)
});

export default ThemeDecorator(AgateApp);
