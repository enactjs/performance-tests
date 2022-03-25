/* eslint-disable react/jsx-no-bind */

import DatePicker from '@enact/sandstone/DatePicker';
import Dropdown from '@enact/sandstone/Dropdown';
import {Heading} from '@enact/sandstone/Heading';
import Scroller from '@enact/sandstone/Scroller';
import Spinner from '@enact/sandstone/Spinner';
import TabLayout, {Tab} from '@enact/sandstone/TabLayout';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
import Layout, {Cell} from '@enact/ui/Layout';
import axios from 'axios';
import classnames from 'classnames';
import {useEffect, useRef, useState} from 'react';

import Chart from '../views/Chart';

import css from './App.module.less';

const listOfComponents = [
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

const App = (props) => {
	const [componentReleasedData, setComponentReleasedData] = useState([]);
	const componentReleasedDataRef = useRef([]);
	componentReleasedDataRef.current = componentReleasedData;

	const [componentDevelopData, setComponentDevelopData] = useState([]);
	const componentDevelopDataRef = useRef([]);
	componentDevelopDataRef.current = componentDevelopData;

	const [selectedComponent, setSelectedComponent] = useState(listOfComponents[0]);
	const [listOfMetrics, setListOfMetrics] = useState([]);
	const [listOfVersions, setListOfVersions] = useState([]);
	const [listOfTestDates, setListOfTestDates] = useState([]);

	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();

	const convertDateFromMilisToYMD = (timestamp) => {
		const date = new Date(timestamp);

		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();

		return year + '-' + month + '-' + day;
	};

	const convertBuildDateStringToMilis = (string) => {
		let year = string.slice(8, 12);
		let month = string.slice(12, 14);
		let day = string.slice(14, 16);
		let hour = string.slice(16, 18);

		// setting the hour to -9 hours prior because the filename contains timestamp in KST
		return new Date(year, month - 1, day, hour - 9, 0, 0).getTime();
	};

	useEffect (() => {
		let developTestDatesStringArray, releaseVersionsStringArray = [];
		axios.get('./releaseVersions.txt')
			.then(result => {
				releaseVersionsStringArray = result.data.split('\n');
				releaseVersionsStringArray.pop();

				setListOfVersions(releaseVersionsStringArray);
			});

		axios.get('./developTestDate.txt')
			.then(result => {
				developTestDatesStringArray = result.data.split('\n');
				developTestDatesStringArray.pop();

				setListOfTestDates(developTestDatesStringArray);
			});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect (() => {
		let componentMetrics = [], promises = [];

		for (let version of listOfVersions) {
			promises.push(axios.get('./' + version + '/' + selectedComponent + '.txt'));
		}

		Promise.allSettled(promises).then((results) => {
			const successfulResults = results.filter((result) => result.status === 'fulfilled');

			for (let result of successfulResults) {
				let resultJSON  = result.value.data.split('\n');
				resultJSON.pop();

				resultJSON.forEach(function (item, index) {
					resultJSON[index] = JSON.parse(resultJSON[index]);
				});

				for (let element of resultJSON) {
					element.date = convertDateFromMilisToYMD(element.timestamp);
					componentMetrics.push(element);
				}
			}

			setComponentReleasedData(componentMetrics);
			setListOfMetrics([...new Set(componentReleasedDataRef.current.map(item => item.type))]);
		});
	}, [listOfVersions, selectedComponent]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect (() => {
		let componentMetrics = [], promises = [];

		for (let buildDate of listOfTestDates) {
			promises.push(axios.get('./develop/' + buildDate + '/' + selectedComponent + '.txt'));
		}

		Promise.allSettled(promises).then((results) => {
			const successfulResults = results.filter((result) => result.status === 'fulfilled');

			for (let result of successfulResults) {
				let resultJSON  = result.value.data.split('\n');
				resultJSON.pop();

				resultJSON.forEach(function (item, index) {
					resultJSON[index] = JSON.parse(resultJSON[index]);
				});

				for ( let element of resultJSON) {
					element.date = convertDateFromMilisToYMD(element.timestamp);
					componentMetrics.push(element);
				}
			}

			setComponentDevelopData(componentMetrics);
		});
	}, [listOfTestDates, selectedComponent]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (listOfTestDates.length > 0) {
			setStartDate(convertBuildDateStringToMilis(listOfTestDates[0]));
			// include all entries from the latest date, regardless of their hour/minute/second
			setEndDate(new Date().getTime() + (1000 * 60 * 60 * 24));
		}
	}, [listOfTestDates]);

	const onComponentSelect = ({data}) => {
		setComponentReleasedData([]);
		setComponentDevelopData([]);
		setSelectedComponent(data);
	};

	const onStartDateSelect = ({value}) => {
		setStartDate(new Date(value).getTime());
	};
	const onEndDateSelect = ({value}) => {
		setEndDate(new Date(value).getTime());
	};

	const getDefaultDate = () => {
		let date = new Date();
		date.setMonth(date.getMonth() - 1);

		return date;
	};

	return (
		<div {...props} className={classnames(props.className, css.app)}>
			<Heading showLine spacing="large" >Sandstone Performance Metrics</Heading>
			<Layout align="start start" orientation="horizontal">
				<Cell shrink>
					<Heading size="small" spacing="none" >Component:</Heading>
					<Dropdown
						className={css.dropdown}
						defaultSelected={0}
						onSelect={onComponentSelect}
						width="x-large"
					>
						{listOfComponents}
					</Dropdown>
				</Cell>
				<Cell shrink>
					<Heading size="small" spacing="none" >Start Date:</Heading>
					<DatePicker
						className={css.datePicker}
						defaultValue={getDefaultDate()}
						noLabel
						maxYear={new Date().getFullYear()}
						onChange={onStartDateSelect}
					/>
				</Cell>
				<Cell shrink>
					<Heading size="small" spacing="none" >End Date:</Heading>
					<DatePicker
						className={css.datePicker}
						noLabel
						maxYear={new Date().getFullYear()}
						onChange={onEndDateSelect}
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
									inputData={componentDevelopData.filter(entry => entry.type === metric && entry.timestamp >= startDate && entry.timestamp <= endDate)}
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
