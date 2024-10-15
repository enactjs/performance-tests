import kind from '@enact/core/kind';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';

import Alert from '../views/sandstone/Alert';
import Button from '../views/sandstone/Button';
import BodyText from '../views/sandstone/BodyText';
import Checkbox from '../views/sandstone/Checkbox';
import CheckboxItem from '../views/sandstone/CheckboxItem';
import ContextualMenuDecorator from '../views/sandstone/ContextualMenuDecorator';
import ContextualPopupDecorator from '../views/sandstone/ContextualPopupDecorator';
import DatePicker from '../views/sandstone/DatePicker';
import DayPicker from '../views/sandstone/DayPicker';
import Dropdown from '../views/sandstone/Dropdown';
import FixedPopupPanels from '../views/sandstone/FixedPopupPanels';
import FlexiblePopupPanels from '../views/sandstone/FlexiblePopupPanels';
import FormCheckboxItem from '../views/sandstone/FormCheckboxItem';
import Heading from '../views/sandstone/Heading';
import Icon from '../views/sandstone/Icon';
import IconItem from '../views/sandstone/IconItem';
import Image from '../views/sandstone/Image';
import ImageItem from '../views/sandstone/ImageItem';
import Input from '../views/sandstone/Input';
import Item from '../views/sandstone/Item';
import Items from '../views/sandstone/Items';
import KeyGuide from '../views/sandstone/KeyGuide';
import Marquee from '../views/sandstone/Marquee';
import MarqueeMultiple from '../views/sandstone/MarqueeMultiple';
import MediaOverlay from '../views/sandstone/MediaOverlay';
import OverallView from '../views/sandstone/OverallView';
import Panels from '../views/sandstone/Panels';
import Picker from '../views/sandstone/Picker';
import PickerJoined from '../views/sandstone/PickerJoined';
import Popup from '../views/sandstone/Popup';
import PopupTabLayout from '../views/sandstone/PopupTabLayout';
import ProgressBar from '../views/sandstone/ProgressBar';
import ProgressButton from '../views/sandstone/ProgressButton';
import QuickGuidePanels from '../views/sandstone/QuickGuidePanels';
import RadioItem from '../views/sandstone/RadioItem';
import RangePicker from '../views/sandstone/RangePicker';
import RangePickerJoined from '../views/sandstone/RangePickerJoined';
import ScrollerPanel from '../views/sandstone/ScrollerPanel';
import ScrollerMultipleChildren from '../views/sandstone/ScrollerMultipleChildren';
import Slider from '../views/sandstone/Slider';
import Spinner from '../views/sandstone/Spinner';
import Steps from '../views/sandstone/Steps';
import Switch from '../views/sandstone/Switch';
import SwitchItem from '../views/sandstone/SwitchItem';
import TabLayout from '../views/sandstone/TabLayout';
import TimePicker from '../views/sandstone/TimePicker';
import TooltipDecorator from '../views/sandstone/TooltipDecorator';
import VideoPlayer from '../views/sandstone/VideoPlayer';
import VirtualListNative from '../views/sandstone/VirtualListNative';
import VirtualListTranslate from '../views/sandstone/VirtualListTranslate';
import WizardPanels from '../views/sandstone/WizardPanels';

import css from './App.less';

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

const SandstoneApp = kind({
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
					<Route path="/virtualListNative" element={<VirtualListNative />} />
					<Route path="/virtualListTranslate" element={<VirtualListTranslate />} />
					<Route path="/wizardPanels" element={<WizardPanels />} />
				</Routes>
			</div>
		</Router>
	)
});

export default ThemeDecorator(SandstoneApp);
