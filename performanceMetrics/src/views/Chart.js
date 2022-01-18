import kind from '@enact/core/kind';
import {Heading} from '@enact/sandstone/Heading';
import PropTypes from 'prop-types';
import {CartesianGrid, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis} from 'recharts';

import css from './Chart.module.less';

const CustomTooltip = ({active, payload}) => {
	if (active && payload && payload.length) {
		return (
			<div className={css.customTooltip}>
				<div>{`Value: ${payload[0].value}`}</div>
				<div>{`Sandstone Version: ${payload[0].payload.SandstoneVersion}`}</div>
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
		inputData: PropTypes.array,
		title: PropTypes.string,
		xAxis: PropTypes.string
	},

	computed: {
		referenceValue: ({title}) => {
			if ( title.includes('FPS') || title.includes('Frames Per Second')) return 50;
			else if (title.includes('CLS')) return 0.1;
			else if (title.includes('FID')) return 100;
			else if (title.includes('FCP')) return 1800;
			else if (title.includes('LCP')) return 2500;
			else if (title.includes('DCL')) return 2000;
		}
	},

	styles: {
		css,
		className: 'chart'
	},

	render: ({inputData, referenceValue, title, xAxis, ...rest}) => {
		return (
			<div {...rest}>
				<Heading size="small" spacing="none">{title}</Heading>
				<LineChart
					width={600}
					height={350}
					data={inputData}
					margin={{
						top: 20,
						right: 50,
						left: 50,
						bottom: 20
					}}
				>
					<CartesianGrid strokeDasharray="10 10" />
					<XAxis dataKey={xAxis} />
					<YAxis domain={['dataMin', 'dataMax']} />
					<ReferenceLine ifOverflow="extendDomain" stroke="red" y={referenceValue} />
					<Tooltip content={<CustomTooltip />} />
					<Line
						type="monotone"
						dataKey="actualValue"
						stroke="#2aa2aa"
						activeDot={{r: 8}}
					/>
				</LineChart>
			</div>
		);
	}
});

export default Chart;
