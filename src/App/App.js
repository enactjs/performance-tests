import kind from '@enact/core/kind';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';

import Alert from '../views/Alert';
import Button from '../views/Button';
import BodyText from '../views/BodyText';
import Checkbox from '../views/Checkbox';
import CheckboxItem from '../views/CheckboxItem';
import ContextualMenuDecorator from '../views/ContextualMenuDecorator';
import ContextualPopupDecorator from '../views/ContextualPopupDecorator';
import DatePicker from '../views/DatePicker';
import DayPicker from '../views/DayPicker';
import Dropdown from '../views/Dropdown';
import FixedPopupPanels from '../views/FixedPopupPanels';
import FlexiblePopupPanels from '../views/FlexiblePopupPanels';
import FormCheckboxItem from '../views/FormCheckboxItem';
import Heading from '../views/Heading';
import Icon from '../views/Icon';
import IconItem from '../views/IconItem';
import Image from '../views/Image';
import ImageItem from '../views/ImageItem';
import Input from '../views/Input';
import Item from '../views/Item';
import Items from '../views/Items';
import KeyGuide from '../views/KeyGuide';
import Marquee from '../views/Marquee';
import MarqueeMultiple from '../views/MarqueeMultiple';
import MediaOverlay from '../views/MediaOverlay';
import OverallView from '../views/OverallView';
import Panels from '../views/Panels';
import Picker from '../views/Picker';
import PickerJoined from '../views/PickerJoined';
import Popup from '../views/Popup';
import PopupTabLayout from '../views/PopupTabLayout';
import ProgressBar from '../views/ProgressBar';
import ProgressButton from '../views/ProgressButton';
import QuickGuidePanels from '../views/QuickGuidePanels';
import RadioItem from '../views/RadioItem';
import RangePicker from '../views/RangePicker';
import RangePickerJoined from '../views/RangePickerJoined';
import ScrollerPanel from '../views/ScrollerPanel';
import ScrollerMultipleChildren from '../views/ScrollerMultipleChildren';
import Slider from '../views/Slider';
import Spinner from '../views/Spinner';
import Steps from '../views/Steps';
import Switch from '../views/Switch';
import SwitchItem from '../views/SwitchItem';
import TabLayout from '../views/TabLayout';
import TimePicker from '../views/TimePicker';
import TooltipDecorator from '../views/TooltipDecorator';
import VideoPlayer from '../views/VideoPlayer';
import VirtualList from '../views/VirtualList';
import WizardPanels from '../views/WizardPanels';

import css from './App.less';

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

const App = kind({
	name: 'App',

	styles: {
		css,
		className: 'app'
	},

	render: (props) => (
		<Router>
			<div {...props}>
				<Routes>
					<Route path="/alert" element={<Alert />} />
					<Route path="/button" element={<Button />} />
					<Route path="/bodyText" element={<BodyText />} />
					<Route path="/checkbox" element={<Checkbox />} />
					<Route path="/checkboxItem" element={<CheckboxItem />} />
					<Route path="/contextualMenuDecorator" element={<ContextualMenuDecorator />} />
					<Route path="/contextualPopupDecorator" element={<ContextualPopupDecorator />} />
					<Route path="/datePicker" element={<DatePicker />} />
					<Route path="/dayPicker" element={<DayPicker />} />
					<Route path="/dropdown" element={<Dropdown />} />
					<Route path="/fixedPopupPanels" element={<FixedPopupPanels />} />
					<Route path="/flexiblePopupPanels" element={<FlexiblePopupPanels />} />
					<Route path="/formCheckboxItem" element={<FormCheckboxItem />} />
					<Route path="/heading" element={<Heading />} />
					<Route path="/icon" element={<Icon />} />
					<Route path="/iconItem" element={<IconItem />} />
					<Route path="/image" element={<Image />} />
					<Route path="/imageItem" element={<ImageItem />} />
					<Route path="/input" element={<Input />} />
					<Route path="/item" element={<Item />} />
					<Route path="/items" element={<Items />} />
					<Route path="/keyGuide" element={<KeyGuide />} />
					<Route path="/marquee" element={<Marquee />} />
					<Route path="/marqueeMultiple" element={<MarqueeMultiple />} />
					<Route path="/mediaOverlay" element={<MediaOverlay />} />
					<Route path="/overallView" element={<OverallView />} />
					<Route path="/panels" element={<Panels />} />
					<Route path="/picker" element={<Picker />} />
					<Route path="/pickerJoined" element={<PickerJoined />} />
					<Route path="/popup" element={<Popup />} />
					<Route path="/popupTabLayout" element={<PopupTabLayout />} />
					<Route path="/progressBar" element={<ProgressBar />} />
					<Route path="/progressButton" element={<ProgressButton />} />
					<Route path="/quickGuidePanels" element={<QuickGuidePanels />} />
					<Route path="/radioItem" element={<RadioItem />} />
					<Route path="/rangePicker" element={<RangePicker />} />
					<Route path="/rangePickerJoined" element={<RangePickerJoined />} />
					<Route path="/scroller" element={<ScrollerPanel />} />
					<Route path="/scrollerMultipleChildren" element={<ScrollerMultipleChildren />} />
					<Route path="/slider" element={<Slider />} />
					<Route path="/spinner" element={<Spinner />} />
					<Route path="/steps" element={<Steps />} />
					<Route path="/switch" element={<Switch />} />
					<Route path="/switchItem" element={<SwitchItem />} />
					<Route path="/tabLayout" element={<TabLayout />} />
					<Route path="/timePicker" element={<TimePicker />} />
					<Route path="/tooltipDecorator" element={<TooltipDecorator />} />
					<Route path="/videoPlayer" element={<VideoPlayer />} />
					<Route path="/virtualList" element={<VirtualList />} />
					<Route path="/wizardPanels" element={<WizardPanels />} />
				</Routes>
			</div>
		</Router>
	)
});

export default ThemeDecorator(App);
