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
import Dropdown from '../views/Dropdown';
import FormCheckboxItem from '../views/FormCheckboxItem';
import Heading from '../views/Heading';
import Image from '../views/Image';
import ImageItem from '../views/ImageItem';
import RadioItem from '../views/RadioItem';


import Picker from '../views/Picker';
import ScrollerPanel from '../views/ScrollerPanel';
import Panels from '../views/Panels';
import ExpandableItem from '../views/ExpandableItem';
import Popup from '../views/Popup';
import Marquee from '../views/Marquee';
import Spinner from '../views/Spinner';
import VirtualList from '../views/VirtualList';
import GridListImageItem from '../views/GridListImageItem';
import Item from '../views/Item';
import Slider from '../views/Slider';
import MarqueeMultiple from '../views/MarqueeMultiple';
import ViewManager from '../views/ViewManager';
import ScrollerMultipleChildren from '../views/ScrollerMultipleChildren';
import Steps from '../views/Steps';
import Switch from '../views/Switch';
import SwitchItem from '../views/SwitchItem';
import TabLayout from '../views/TabLayout';
import TimePicker from '../views/TimePicker';
import TooltipDecorator from '../views/TooltipDecorator';
import VideoPlayer from '../views/VideoPlayer';
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
				<Route path="/bodyText" component={BodyText} />
				<Route path="/checkbox" component={Checkbox} />
				<Route path="/checkboxItem" component={CheckboxItem} />
				<Route path="/contextualMenuDecorator" component={ContextualMenuDecorator} />
				<Route path="/contextualPopupDecorator" component={ContextualPopupDecorator} />
				<Route path="/datePicker" component={DatePicker} />
				<Route path="/dropdown" component={Dropdown} />
				<Route path="/formCheckboxItem" component={FormCheckboxItem} />
				<Route path="/heading" component={Heading} />
				<Route path="/image" component={Image} />
				<Route path="/imageItem" component={ImageItem} />
				<Route path="/radioItem" component={RadioItem} />

				<Route path="/panels" component={Panels} />
				<Route path="/picker" component={Picker} />
				<Route path="/scroller" component={ScrollerPanel} />
				<Route path="/expandableItem" component={ExpandableItem} />
				<Route path="/popup" component={Popup} />
				<Route path="/marquee" component={Marquee} />
				<Route path="/spinner" component={Spinner} />
				<Route path="/virtualList" component={VirtualList} />
				<Route path="/gridListImageItem" component={GridListImageItem} />
				<Route path="/item" component={Item} />
				<Route path="/slider" component={Slider} />
				<Route path="/marqueeMultiple" component={MarqueeMultiple} />
				<Route path="/viewManager" component={ViewManager} />
				<Route path="/scrollerMultipleChildren" component={ScrollerMultipleChildren} />
				<Route path="/steps" component={Steps} />
				<Route path="/switch" component={Switch} />
				<Route path="/switchItem" component={SwitchItem} />
				<Route path="/tabLayout" component={TabLayout} />
				<Route path="/timePicker" component={TimePicker} />
				<Route path="/tooltipDecorator" component={TooltipDecorator} />
				<Route path="/videoPlayer" component={VideoPlayer} />
				<Route path="/wizardPanels" component={WizardPanels} />
			</div>
		</Router>
	)
});

export default ThemeDecorator(App);
