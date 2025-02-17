import kind from '@enact/core/kind';
import Button from '@enact/limestone/Button';
import TooltipDecorator from '@enact/limestone/TooltipDecorator';

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
