import DatePicker from '@enact/sandstone/DatePicker';
import Dropdown from '@enact/sandstone/Dropdown';
import {Heading} from '@enact/sandstone/Heading';
import Scroller from '@enact/sandstone/Scroller';
import Spinner from '@enact/sandstone/Spinner';
import TabLayout, {Tab} from '@enact/sandstone/TabLayout';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
import Layout, {Cell} from '@enact/ui/Layout';
import classnames from 'classnames';
import {useCallback, useEffect, useState} from 'react';

import Chart from '../views/Chart';

import css from './App.module.less';

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
	'TooltipDecorator',
	'VirtualList',
	'WindDirectionControl'
];

const listOfThemes = ['Sandstone', 'Agate'];

const App = (props) => {
	const [componentReleasedData, setComponentReleasedData] = useState([]);
	const [componentDevelopData, setComponentDevelopData] = useState([]);
	const [selectedTheme, setSelectedTheme] = useState(listOfThemes[0]);
	const [selectedListOfComponents, setSelectedListOfComponents] = useState(listOfSandstoneComponent);
	const [selectedComponent, setSelectedComponent] = useState(selectedListOfComponents[0]);
	const [listOfMetrics, setListOfMetrics] = useState([]);
	const [listOfVersions, setListOfVersions] = useState([]);
	const [listOfTestDates, setListOfTestDates] = useState([]);

	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();

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

	useEffect (() => {
		let developTestDatesStringArray, releaseVersionsStringArray = [];
		fetch('./' + selectedTheme + '/releaseVersions.txt')
			.then(result => result.text())
			.then(result => {
				releaseVersionsStringArray = result.split('\n');
				releaseVersionsStringArray.pop();

				setListOfVersions(releaseVersionsStringArray);
			});

		fetch('./' + selectedTheme + '/developTestDate.txt')
			.then(result => result.text())
			.then(result => {
				developTestDatesStringArray = result.split('\n');
				developTestDatesStringArray.pop();

				setListOfTestDates(developTestDatesStringArray);
			});
	}, [selectedTheme]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect (() => {
		let componentMetrics = [], promises = [];

		for (let version of listOfVersions) {
			promises.push(fetch('./' + selectedTheme + '/' + version + '/' + selectedComponent + '.txt').then(result => result.text()));
		}

		Promise.allSettled(promises).then((results) => {
			const successfulResults = results.filter((result) => result.value.includes('ReactVersion'));

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
	}, [listOfVersions, selectedComponent]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect (() => {
		let componentMetrics = [], promises = [];
		for (let buildDate of listOfTestDates) {
			const date = getDateFromBuildDate(buildDate);
			if (startDate <= date && endDate >= date) {
				promises.push(fetch('./' + selectedTheme + '/develop/' + buildDate + '/' + selectedComponent + '.txt').then(result => result.text()));
			}
		}

		Promise.allSettled(promises).then((results) => {
			const successfulResults = results.filter((result) => result.value.includes('ReactVersion'));

			for (let result of successfulResults) {
				let resultJSON  = result.value.split('\n');
				resultJSON.pop();

				resultJSON.forEach(function (item, index) {
					resultJSON[index] = JSON.parse(resultJSON[index]);
				});

				for ( let element of resultJSON) {
					element.date = convertDateFromMillisToYMD(element.timestamp);
					componentMetrics.push(element);
				}
			}

			setComponentDevelopData(componentMetrics);
		});
	}, [endDate, listOfTestDates, selectedComponent, startDate]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (listOfTestDates.length > 0) {
			setStartDate(getDefaultStartDate());
			setEndDate(Date.now());
		}
	}, [listOfTestDates]);

	const onThemeSelect = useCallback(({data}) => {
		setSelectedTheme(data);
		setSelectedListOfComponents(data === 'Sandstone' ? listOfSandstoneComponent : listOfAgateComponent);
	}, []);

	useEffect(() => {
		setSelectedComponent(selectedListOfComponents[0]);
	}, [selectedListOfComponents]);

	const onComponentSelect = useCallback(({data}) => {
		setComponentReleasedData([]);
		setComponentDevelopData([]);
		setSelectedComponent(data);
	}, []);


	const onStartDateSelect = useCallback(({value}) => {
		setStartDate(new Date(value).getTime());
	}, []);

	const onEndDateSelect = useCallback(({value}) => {
		setEndDate(new Date(value).getTime());
	}, []);

	return (
		<div {...props} className={classnames(props.className, css.app)}>
			<Heading showLine spacing="large" >Sandstone Performance Metrics</Heading>
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
									key={metric}
									inputData={componentReleasedData.filter(entry => entry.type === metric && entry.timestamp >= startDate && entry.timestamp <= endDate)}
									title={metric}
									xAxis="SandstoneVersion"
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
