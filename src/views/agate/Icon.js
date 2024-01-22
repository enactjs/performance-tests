import Icon from '@enact/agate/Icon';
import kind from '@enact/core/kind';

const IconView = kind({
	name: 'IconView',

	render: () => (
		<>
			<div>Icon</div>
			<Icon id="icon">plus</Icon>
		</>
	)
});

export default IconView;
