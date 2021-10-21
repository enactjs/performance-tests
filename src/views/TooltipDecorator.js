import kind from '@enact/core/kind';
import Button from '@enact/sandstone/Button';
import TooltipDecorator from '@enact/sandstone/TooltipDecorator';

const TooltipButton = TooltipDecorator({tooltipDestinationProp: 'decoration'}, Button);

const TooltipDecoratorView = kind({
	name: 'TooltipDecoratorView',

	render: () => (
		<TooltipButton
			id="tooltipDecorator"
			tooltipText="tooltip!"
		>
			Click me
		</TooltipButton>
	)
});

export default TooltipDecoratorView;
