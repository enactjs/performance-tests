import kind from '@enact/core/kind';
import Icon from '@enact/sandstone/Icon';

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
