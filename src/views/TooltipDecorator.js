import kind from '@enact/core/kind';
import Button from '@enact/sandstone/Button';
import TooltipDecorator from '@enact/sandstone/TooltipDecorator';
import {Profiler} from 'react';

import {putRenderedMark} from '../utils';

const TooltipButton = TooltipDecorator({tooltipDestinationProp: 'decoration'}, Button);

const TooltipDecoratorView = kind({
	name: 'TooltipDecoratorView',

	render: () => (
		<Profiler id="tooltipDecorator-rendered" onRender={putRenderedMark}>
			<TooltipButton
				id="tooltipDecorator"
				tooltipText='tooltip!'
			>
				Click me
			</TooltipButton>
		</Profiler>
	)
});

export default TooltipDecoratorView;
