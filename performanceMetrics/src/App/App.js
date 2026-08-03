import DatePicker from '@enact/limestone/DatePicker';
import Dropdown from '@enact/limestone/Dropdown';
import {Heading} from '@enact/limestone/Heading';
import Scroller from '@enact/limestone/Scroller';
import Spinner from '@enact/limestone/Spinner';
import TabLayout, {Tab} from '@enact/limestone/TabLayout';
import ThemeDecorator from '@enact/limestone/ThemeDecorator';
import Layout, {Cell} from '@enact/ui/Layout';
import classnames from 'classnames';
import {useCallback, useEffect, useState} from 'react';

import Chart from '../views/Chart';

import css from './App.module.less';

const listOfLimestoneComponent = [
	'Overall',
	'ActionGuide',
	'Alert',
	'BodyText',
	'Button',
	'Card',
	'Checkbox',
	'CheckboxItem',
	'Chips',
	'ColorPicker',
	'ContextualMenuDecorator',
	'ContextualPopupDecorator',
	'DatePicker',
	'DayPicker',
	'Dropdown',
	'FixedPopupPanels',
	'FlexiblePopupPanels',
	'FormCheckboxItem',
	'Heading',
	'Icon',
	'IconItem',
	'Image',
	'ImageItem',
	'Input',
	'Item',
	'KeyGuide',
	'Marquee',
	'MediaOverlay',
	'PageViews',
	'Panels',
	'Picker joined',
	'Picker',
	'Popup',
	'PopupTabLayout',
	'ProgressBar',
	'ProgressButton',
	'QuickGuidePanels',
	'RadioItem',
	'RangePicker joined',
	'RangePicker',
	'Scroller',
	'Slider',
	'Spinner',
	'Steps',
	'Switch',
	'SwitchItem',
	'TabLayout',
	'TimePicker',
	'TooltipDecorator',
	'VideoPlayer',
	'VirtualList',
	'WizardPanels'
];

const listOfSandstoneComponent = [
	'Overall',
	'Alert',
	'BodyText',
	'Button',
	'Checkbox',
	'CheckboxItem',
	'ContextualMenuDecorator',
	'ContextualPopupDecorator',
	'DatePicker',
	'DayPicker',
	'Dropdown',
	'FixedPopupPanels',
	'FlexiblePopupPanels',
	'FormCheckboxItem',
	'Heading',
	'Icon',
	'IconItem',
	'Image',
	'ImageItem',
	'Input',
	'Item',
	'KeyGuide',
	'Marquee',
	'MediaOverlay',
	'Panels',
	'Picker joined',
	'Picker',
	'Popup',
	'PopupTabLayout',
	'ProgressBar',
	'ProgressButton',
	'QuickGuidePanels',
	'RadioItem',
	'RangePicker joined',
	'RangePicker',
	'Scroller',
	'Slider',
	'Spinner',
	'Steps',
	'Switch',
	'SwitchItem',
	'TabLayout',
	'TimePicker',
	'TooltipDecorator',
	'VideoPlayer',
	'VirtualList',
	'WizardPanels'
];

const listOfAgateComponent = [
	'Overall',
	'ArcPicker',
	'ArcSlider',
	'BodyText',
	'Button',
	'Checkbox',
	'CheckboxItem',
	'ContextualPopupDecorator',
	'DatePicker',
	'DateTimePicker',
	'Drawer',
	'Dropdown',
	'FanSpeedControl',
	'Header',
	'Heading',
	'Icon',
	'Image',
	'ImageItem',
	'IncrementSlider',
	'Input',
	'Item',
	'Keypad',
	'LabeledIcon',
	'LabeledIconButton',
	'Marquee',
	'MediaPlayer',
	'Panels',
	'Picker',
	'Popup',
	'PopupMenu',
	'RadioItem',
	'RangePicker',
	'Scroller',
	'Slider',
	'SliderButton',
	'SwitchItem',
	'TabGroup',
	'TemperatureControl',
	'ThumbnailItem',
	'TimePicker',
	'ToggleButton',
	'TooltipDecorator',
	'VirtualList',
	'WindDirectionControl'
];

const listOfThemes = ['Limestone', 'Sandstone', 'Agate'];

// Pure date helpers — kept at module scope so they are not recreated on every
// render and do not need to be listed as effect dependencies.
const convertDateFromMillisToYMD = (timestamp) => {
	const date = new Date(timestamp);

	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	return year + '-' + month + '-' + day;
};

const getDateFromBuildDate = (buildDate) => {
	const date = buildDate.split('-').pop();
	const year = date.slice(0, 4);
	const month = date.slice(4, 6);
	const day = date.slice(6, 8);

	return new Date(year, month - 1, day).getTime();
};

const getDefaultStartDate = () => {
	let date = new Date();
	date.setMonth(date.getMonth() - 1);

	return date.getTime() - (9 * 60 * 60 * 1000);
};

const App = (props) => {
	const [componentReleasedData, setComponentReleasedData] = useState([]);
	const [componentDevelopData, setComponentDevelopData] = useState([]);
	const [selectedTheme, setSelectedTheme] = useState(listOfThemes[0]);
	const [selectedListOfComponents, setSelectedListOfComponents] = useState(listOfLimestoneComponent);
	const [selectedComponent, setSelectedComponent] = useState(selectedListOfComponents[0]);
	const [listOfMetrics, setListOfMetrics] = useState([]);
	const [listOfVersions, setListOfVersions] = useState([]);
	const [listOfTestDates, setListOfTestDates] = useState([]);

	// Lazy initial state so the date range is valid on the first render
	// (avoids passing `new Date(undefined)` — an Invalid Date — to DatePicker).
	const [startDate, setStartDate] = useState(getDefaultStartDate);
	const [endDate, setEndDate] = useState(() => Date.now());

	useEffect (() => {
		let ignore = false;
		let developTestDatesStringArray, releaseVersionsStringArray = [];

		fetch('./' + selectedTheme.toLowerCase() + '/releaseVersions.txt')
			.then(result => result.text())
			.then(result => {
				if (ignore) return;
				releaseVersionsStringArray = result.split('\n');
				releaseVersionsStringArray.pop();

				setListOfVersions(releaseVersionsStringArray);
			});

		fetch('./' + selectedTheme.toLowerCase() + '/developTestDate.txt')
			.then(result => result.text())
			.then(result => {
				if (ignore) return;
				developTestDatesStringArray = result.split('\n');
				developTestDatesStringArray.pop();

				setListOfTestDates(developTestDatesStringArray);
			});

		return () => {
			ignore = true;
		};
	}, [selectedTheme]);

	useEffect (() => {
		let ignore = false;
		let componentMetrics = [], promises = [];

		if (selectedComponent) {
			for (let version of listOfVersions) {
				promises.push(fetch('./' + selectedTheme.toLowerCase() + '/' + version + '/' + selectedComponent + '.txt').then(result => result.text()));
			}

			Promise.allSettled(promises).then((results) => {
				if (ignore) return;
				const successfulResults = results.filter((result) => result.status === 'fulfilled' && result.value.includes('ReactVersion'));

				for (let result of successfulResults) {
					let resultJSON  = result.value.split('\n');
					resultJSON.pop();

					resultJSON.forEach(function (item, index) {
						resultJSON[index] = JSON.parse(resultJSON[index]);
					});

					for (let element of resultJSON) {
						element.date = convertDateFromMillisToYMD(element.timestamp);
						componentMetrics.push(element);
					}
				}

				setComponentReleasedData(componentMetrics);
				setListOfMetrics([...new Set(componentMetrics.map(item => item.type))]);
			});
		}

		return () => {
			ignore = true;
		};
	}, [listOfVersions, selectedComponent, selectedTheme]);

	useEffect (() => {
		let ignore = false;
		let componentMetrics = [], promises = [];

		if (selectedComponent) {
			for (let buildDate of listOfTestDates) {
				const date = getDateFromBuildDate(buildDate);
				if (startDate <= date && endDate >= date) {
					promises.push(fetch('./' + selectedTheme.toLowerCase() + '/develop/' + buildDate + '/' + selectedComponent + '.txt').then(result => result.text()));
				}
			}

			Promise.allSettled(promises).then((results) => {
				if (ignore) return;
				const successfulResults = results.filter((result) => result.status === 'fulfilled' && result.value.includes('ReactVersion'));

				for (let result of successfulResults) {
					let resultJSON  = result.value.split('\n');
					resultJSON.pop();

					resultJSON.forEach(function (item, index) {
						resultJSON[index] = JSON.parse(resultJSON[index]);
					});

					for (let element of resultJSON) {
						element.date = convertDateFromMillisToYMD(element.timestamp);
						componentMetrics.push(element);
					}
				}

				setComponentDevelopData(componentMetrics);
			});
		}

		return () => {
			ignore = true;
		};
	}, [endDate, listOfTestDates, selectedComponent, selectedTheme, startDate]);

	const onThemeSelect = useCallback(({data}) => {
		let listOfComponents;
		switch (data) {
			case "Limestone":
				listOfComponents = listOfLimestoneComponent;
				break;
			case "Sandstone":
				listOfComponents = listOfSandstoneComponent;
				break;
			case "Agate":
				listOfComponents = listOfAgateComponent;
				break;
			default:
				listOfComponents = listOfLimestoneComponent;
		}

		// Reset selection, cached data and date range in the event handler rather
		// than in a cascading effect that reacts to the theme change.
		setSelectedTheme(data);
		setSelectedListOfComponents(listOfComponents);
		setSelectedComponent(listOfComponents[0]);
		setComponentReleasedData([]);
		setComponentDevelopData([]);
		setStartDate(getDefaultStartDate());
		setEndDate(Date.now());
	}, []);

	const onComponentSelect = useCallback(({data}) => {
		if (data !== selectedComponent) {
			setComponentReleasedData([]);
			setComponentDevelopData([]);
			setSelectedComponent(data);
		}
	}, [selectedComponent]);


	const onStartDateSelect = useCallback(({value}) => {
		setStartDate(new Date(value).getTime());
	}, []);

	const onEndDateSelect = useCallback(({value}) => {
		setEndDate(new Date(value).getTime());
	}, []);

	let xAxisLabel;
	switch (selectedTheme) {
		case "Limestone":
			xAxisLabel = "LimestoneVersion";
			break;
		case "Sandstone":
			xAxisLabel = "SandstoneVersion";
			break;
		case "Agate":
			xAxisLabel = "AgateVersion";
			break;
		default:
			xAxisLabel = "LimestoneVersion";
	}

	return (
		<div {...props} className={classnames(props.className, css.app)}>
			<Heading showLine spacing="large" >Enact Performance Metrics</Heading>
			<Layout align="start start" orientation="horizontal">
				<Cell shrink>
					<Heading size="small" spacing="none" >Theme Library:</Heading>
					<Dropdown
						className={css.dropdown}
						defaultSelected={0}
						onSelect={onThemeSelect}
						width="large"
					>
						{listOfThemes}
					</Dropdown>
				</Cell>
				<Cell shrink>
					<Heading size="small" spacing="none" >Component:</Heading>
					<Dropdown
						className={css.dropdown}
						onSelect={onComponentSelect}
						selected={selectedListOfComponents.findIndex(value => value === selectedComponent)}
						width="large"
					>
						{selectedListOfComponents}
					</Dropdown>
				</Cell>
				<Cell shrink>
					<Heading size="small" spacing="none" >Start Date:</Heading>
					<DatePicker
						className={css.datePicker}
						noLabel
						maxYear={new Date().getFullYear()}
						onChange={onStartDateSelect}
						value={new Date(startDate)}
					/>
				</Cell>
				<Cell shrink>
					<Heading size="small" spacing="none" >End Date:</Heading>
					<DatePicker
						className={css.datePicker}
						noLabel
						maxYear={new Date().getFullYear()}
						onChange={onEndDateSelect}
						value={new Date(endDate)}
					/>
				</Cell>
			</Layout>
			<TabLayout orientation="horizontal" className={css.tabLayout}>
				<Tab title="Released versions metrics">
					{componentReleasedData.length === 0 ?
						<div>Loading data <Spinner size="small" /></div> :
						<Scroller focusableScrollbar verticalScrollbar="visible">
							{listOfMetrics.map((metric) =>
								<Chart
									component={selectedComponent}
									key={metric}
									inputData={componentReleasedData.filter(entry => entry.type === metric && entry.timestamp >= startDate && entry.timestamp <= endDate)}
									title={metric}
									xAxis={xAxisLabel}
								/>
							)}
						</Scroller>
					}
				</Tab>
				<Tab title="Develop branch metrics">
					{componentDevelopData.length === 0 ?
						<div>Loading data <Spinner size="small" /></div> :
						<Scroller focusableScrollbar verticalScrollbar="visible">
							{listOfMetrics.map((metric) =>
								<Chart
									component={selectedComponent}
									key={metric}
									inputData={componentDevelopData.filter(entry => entry.type === metric)}
									title={metric}
									xAxis="date"
								/>
							)}
						</Scroller>
					}
				</Tab>
			</TabLayout>
		</div>
	);
};

export default ThemeDecorator(App);
