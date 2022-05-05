import kind from '@enact/core/kind';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';

import Alert from '../views/Alert';
import Button from '../views/Button';
import ButtonA11y from '../views/ButtonA11y';
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
import Image from '../views/Image';
import ImageItem from '../views/ImageItem';
import Input from '../views/Input';
import Item from '../views/Item';
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
import RadioItem from '../views/RadioItem';
import RangePicker from '../views/RangePicker';
import RangePickerJoined from '../views/RangePickerJoined';
import ScrollerPanel from '../views/ScrollerPanel';
import ScrollerMultipleChildren from '../views/ScrollerMultipleChildren';
import Slider from '../views/Slider';
import SliderA11y from '../views/SliderA11y';
import Spinner from '../views/Spinner';
import Steps from '../views/Steps';
import Switch from '../views/Switch';
import SwitchItem from '../views/SwitchItem';
import SwitchItemA11y from '../views/SwitchItemA11y';
import TabLayout from '../views/TabLayout';
import TabLayoutA11y from '../views/TabLayoutA11y';
import TimePicker from '../views/TimePicker';
import TooltipDecorator from '../views/TooltipDecorator';
import VideoPlayer from '../views/VideoPlayer';
import VideoPlayerA11y from '../views/VideoPlayerA11y';
import VirtualList from '../views/VirtualList';
import WizardPanels from '../views/WizardPanels';

import css from './App.less';

import {BrowserRouter as Router, Route} from 'react-router-dom';

const App = kind({
	name: 'App',

	styles: {
		css,
		className: 'app'
	},

	render: (props) => (
		<Router>
			<div {...props}>
				<Route path="/alert" component={Alert} />
				<Route path="/button" component={Button} />
				<Route path="/buttonA11y" component={ButtonA11y} />
				<Route path="/bodyText" component={BodyText} />
				<Route path="/checkbox" component={Checkbox} />
				<Route path="/checkboxItem" component={CheckboxItem} />
				<Route path="/contextualMenuDecorator" component={ContextualMenuDecorator} />
				<Route path="/contextualPopupDecorator" component={ContextualPopupDecorator} />
				<Route path="/datePicker" component={DatePicker} />
				<Route path="/dayPicker" component={DayPicker} />
				<Route path="/dropdown" component={Dropdown} />
				<Route path="/fixedPopupPanels" component={FixedPopupPanels} />
				<Route path="/flexiblePopupPanels" component={FlexiblePopupPanels} />
				<Route path="/formCheckboxItem" component={FormCheckboxItem} />
				<Route path="/heading" component={Heading} />
				<Route path="/icon" component={Icon} />
				<Route path="/image" component={Image} />
				<Route path="/imageItem" component={ImageItem} />
				<Route path="/input" component={Input} />
				<Route path="/item" component={Item} />
				<Route path="/keyGuide" component={KeyGuide} />
				<Route path="/marquee" component={Marquee} />
				<Route path="/marqueeMultiple" component={MarqueeMultiple} />
				<Route path="/mediaOverlay" component={MediaOverlay} />
				<Route path="/overallView" component={OverallView} />
				<Route path="/panels" component={Panels} />
				<Route path="/picker" component={Picker} />
				<Route path="/pickerJoined" component={PickerJoined} />
				<Route path="/popup" component={Popup} />
				<Route path="/popupTabLayout" component={PopupTabLayout} />
				<Route path="/progressBar" component={ProgressBar} />
				<Route path="/progressButton" component={ProgressButton} />
				<Route path="/radioItem" component={RadioItem} />
				<Route path="/rangePicker" component={RangePicker} />
				<Route path="/rangePickerJoined" component={RangePickerJoined} />
				<Route path="/scroller" component={ScrollerPanel} />
				<Route path="/scrollerMultipleChildren" component={ScrollerMultipleChildren} />
				<Route path="/slider" component={Slider} />
				<Route path="/sliderA11y" component={SliderA11y} />
				<Route path="/spinner" component={Spinner} />
				<Route path="/steps" component={Steps} />
				<Route path="/switch" component={Switch} />
				<Route path="/switchItem" component={SwitchItem} />
				<Route path="/switchItemA11y" component={SwitchItemA11y} />
				<Route path="/tabLayout" component={TabLayout} />
				<Route path="/tabLayoutA11y" component={TabLayoutA11y} />
				<Route path="/timePicker" component={TimePicker} />
				<Route path="/tooltipDecorator" component={TooltipDecorator} />
				<Route path="/videoPlayer" component={VideoPlayer} />
				<Route path="/videoPlayerA11y" component={VideoPlayerA11y} />
				<Route path="/virtualList" component={VirtualList} />
				<Route path="/wizardPanels" component={WizardPanels} />
			</div>
		</Router>
	)
});

export default ThemeDecorator(App);
