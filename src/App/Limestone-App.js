import kind from '@enact/core/kind';
import ThemeDecorator from '@enact/limestone/ThemeDecorator';
import {HashRouter as Router, Route, Routes} from 'react-router-dom';

import Alert from '../views/limestone/Alert';
import Button from '../views/limestone/Button';
import BodyText from '../views/limestone/BodyText';
import Checkbox from '../views/limestone/Checkbox';
import CheckboxItem from '../views/limestone/CheckboxItem';
import ContextualMenuDecorator from '../views/limestone/ContextualMenuDecorator';
import ContextualPopupDecorator from '../views/limestone/ContextualPopupDecorator';
import DatePicker from '../views/limestone/DatePicker';
import DayPicker from '../views/limestone/DayPicker';
import Dropdown from '../views/limestone/Dropdown';
import FixedPopupPanels from '../views/limestone/FixedPopupPanels';
import FlexiblePopupPanels from '../views/limestone/FlexiblePopupPanels';
import FormCheckboxItem from '../views/limestone/FormCheckboxItem';
import Heading from '../views/limestone/Heading';
import Icon from '../views/limestone/Icon';
import IconItem from '../views/limestone/IconItem';
import Image from '../views/limestone/Image';
import ImageItem from '../views/limestone/ImageItem';
import Input from '../views/limestone/Input';
import Item from '../views/limestone/Item';
import Items from '../views/limestone/Items';
import KeyGuide from '../views/limestone/KeyGuide';
import Marquee from '../views/limestone/Marquee';
import MarqueeMultiple from '../views/limestone/MarqueeMultiple';
import MediaOverlay from '../views/limestone/MediaOverlay';
import OverallView from '../views/limestone/OverallView';
import Panels from '../views/limestone/Panels';
import Picker from '../views/limestone/Picker';
import PickerJoined from '../views/limestone/PickerJoined';
import Popup from '../views/limestone/Popup';
import PopupTabLayout from '../views/limestone/PopupTabLayout';
import ProgressBar from '../views/limestone/ProgressBar';
import ProgressButton from '../views/limestone/ProgressButton';
import QuickGuidePanels from '../views/limestone/QuickGuidePanels';
import RadioItem from '../views/limestone/RadioItem';
import RangePicker from '../views/limestone/RangePicker';
import RangePickerJoined from '../views/limestone/RangePickerJoined';
import ScrollerPanel from '../views/limestone/ScrollerPanel';
import ScrollerMultipleChildren from '../views/limestone/ScrollerMultipleChildren';
import Slider from '../views/limestone/Slider';
import Spinner from '../views/limestone/Spinner';
import Steps from '../views/limestone/Steps';
import Switch from '../views/limestone/Switch';
import SwitchItem from '../views/limestone/SwitchItem';
import TabLayout from '../views/limestone/TabLayout';
import TimePicker from '../views/limestone/TimePicker';
import TooltipDecorator from '../views/limestone/TooltipDecorator';
import VideoPlayer from '../views/limestone/VideoPlayer';
import VirtualList from '../views/limestone/VirtualList';
import WizardPanels from '../views/limestone/WizardPanels';

import css from './App.less';

const LimestoneApp = kind({
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

export default ThemeDecorator(LimestoneApp);
