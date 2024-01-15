import Button from '@enact/agate/Button';
import TooltipDecorator from '@enact/agate/TooltipDecorator';
import kind from '@enact/core/kind';

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
