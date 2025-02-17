import kind from '@enact/core/kind';
import {Heading} from '@enact/sandstone/Heading';
import PropTypes from 'prop-types';
import {CartesianGrid, Label, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis} from 'recharts';

import css from './Chart.module.less';

const CustomTooltip = ({active, payload}) => {
	if (active && payload && payload.length) {
		return (
			<div className={css.customTooltip}>
				<div>{`Value: ${payload[0].value}`}</div>
				{payload[0].payload.LimestoneVersion ? <div>{`Limestone Version: ${payload[0].payload.LimestoneVersion}`}</div> : <></>}
				{payload[0].payload.SandstoneVersion ? <div>{`Sandstone Version: ${payload[0].payload.SandstoneVersion}`}</div> : <></>}
				{payload[0].payload.AgateVersion ? <div>{`Agate Version: ${payload[0].payload.AgateVersion}`}</div> : <></>}
				<div>{`Date: ${payload[0].payload.date}`}</div>
			</div>
		);
	}
	return null;
};

CustomTooltip.propTypes = {
	active: PropTypes.bool,
	payload: PropTypes.array
};

const Chart = kind({
	name: 'Chart',

	propTypes:  {
		component: PropTypes.string,
		inputData: PropTypes.array,
		title: PropTypes.string,
		xAxis: PropTypes.string
	},

	computed: {
		referenceValue: ({component, title}) => {
			if (title.includes('FPS') || title.includes('Frames Per Second')) {
				if (component === 'VirtualList') {
					if (title.includes('Translate')) {
						return 40;
					} else {
						return 55;
					}
				} else {
					return 50;
				}
			}
			else if (title.includes('CLS')) return 0.1;
			else if (title.includes('FID')) return 100;
			else if (title.includes('INP')) return 200;
			else if (title.includes('FCP')) return 1800;
			else if (title.includes('LCP')) return 2500;
			else if (title.includes('DCL')) return 2000;
		},
		fullTitle: ({title}) => {
			if (title.includes('FPS') || title.includes('Frames Per Second')) return title.replace('FPS', 'FPS (Frames Per Second)');
			else if (title.includes('CLS')) return title.replace('CLS', 'CLS (Cumulative Layout Shift)');
			else if (title.includes('FID')) return title.replace('FID', 'FID (First Input Delay)');
			else if (title.includes('INP')) return title.replace('INP', 'INP (Interaction to Next Paint)');
			else if (title.includes('FCP')) return title.replace('FCP', 'FCP (First Contentful Paint)');
			else if (title.includes('LCP')) return title.replace('LCP', 'LCP (Largest Contentful Paint)');
			else if (title.includes('DCL')) return title.replace('DCL', 'DCL (DOM Content Load)');
		},
		referenceLabel: ({title}) => {
			if (title.includes('FPS') || title.includes('Frames Per Second')) return 'Min Value';
			else if (title.includes('CLS') || title.includes('FID') | title.includes('INP') || title.includes('FCP') || title.includes('LCP') || title.includes('DCL')) return 'Max Value';
		},
		xLabel: ({xAxis}) => {
			if (xAxis.includes('LimestoneVersion')) return 'Limestone Version';
			else if (xAxis.includes('SandstoneVersion')) return 'Sandstone Version';
			else if (xAxis.includes('AgateVersion')) return 'Agate Version';
			else if (xAxis.includes('date'))  return 'Date';
		},
		yLabel: ({title}) => {
			if (title.includes('FPS') || title.includes('Frames Per Second')) return 'fps';
			else if (title.includes('FID') || title.includes('INP') || title.includes('FCP') || title.includes('LCP') || title.includes('DCL')) return 'ms';
			else return null;
		}
	},

	styles: {
		css,
		className: 'chart'
	},

	render: ({fullTitle, inputData, referenceLabel, referenceValue, xAxis, xLabel, yLabel, ...rest}) => {
		return (
			<div {...rest}>
				<Heading spacing="none" size="small">{fullTitle}</Heading>
				<LineChart
					data={inputData}
					height={350}
					margin={{
						top: 20,
						right: 80,
						left: 80,
						bottom: 50
					}}
					width={900}
				>
					<CartesianGrid strokeDasharray="10 10" />
					<XAxis dataKey={xAxis} interval="preserveStartEnd">
						<Label
							offset={10}
							position="bottom"
							style={{fill: '#e6e6e6', textAnchor: 'middle'}}
							value={xLabel}
						/>
					</XAxis>
					<YAxis domain={[0, 'dataMax']} unit={yLabel} />
					<ReferenceLine
						className={css.referenceLine}
						ifOverflow="extendDomain"
						stroke="red"
						strokeWidth={3}
						y={referenceValue}
					>
						<Label
							style={{fill: '#e6e6e6', textAnchor: 'middle'}}
							value={referenceLabel}
						/>
					</ReferenceLine>
					<Tooltip content={<CustomTooltip />} />
					<Line
						type="monotone"
						dataKey="actualValue"
						stroke="#2aa2aa"
						strokeWidth={3}
						activeDot={{r: 8}}
					/>
				</LineChart>
			</div>
		);
	}
});

export default Chart;
