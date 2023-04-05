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
	const [componentDevelopData, setComponentDevelopData] = useState([]);
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

	const getDefaultStartDate = () => {
		let date = new Date();
		date.setMonth(date.getMonth() - 1);

		return date.getTime() - (9 * 60 * 60 * 1000);
	};

	useEffect (() => {
		let developTestDatesStringArray, releaseVersionsStringArray = [];
		fetch('./releaseVersions.txt')
			.then(result => result.text())
			.then(result => {
				releaseVersionsStringArray = result.split('\n');
				releaseVersionsStringArray.pop();

				setListOfVersions(releaseVersionsStringArray);
			});

		fetch('./developTestDate.txt')
			.then(result => result.text())
			.then(result => {
				developTestDatesStringArray = result.split('\n');
				developTestDatesStringArray.pop();

				setListOfTestDates(developTestDatesStringArray);
			});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect (() => {
		let componentMetrics = [], promises = [];

		for (let version of listOfVersions) {
			promises.push(fetch('./' + version + '/' + selectedComponent + '.txt').then(result => result.text()));
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
					element.date = convertDateFromMilisToYMD(element.timestamp);
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
			promises.push(fetch('./develop/' + buildDate + '/' + selectedComponent + '.txt').then(result => result.text()));
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
					element.date = convertDateFromMilisToYMD(element.timestamp);
					componentMetrics.push(element);
				}
			}

			setComponentDevelopData(componentMetrics);
		});
	}, [listOfTestDates, selectedComponent]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (listOfTestDates.length > 0) {
			setStartDate(getDefaultStartDate());
			setEndDate(Date.now());
		}
	}, [listOfTestDates]);

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
