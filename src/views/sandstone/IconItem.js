import kind from '@enact/core/kind';
import IconItem from '@enact/sandstone/IconItem';

const itemStyle = {marginInline: 'auto', width: '80%'};

const IconItemView = kind({
	name: 'IconItemView',

	render: () => (
		<IconItem icon="usb" id="iconItem" style={itemStyle} />
	)
});

export default IconItemView;
