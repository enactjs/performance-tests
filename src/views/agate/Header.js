import Button from '@enact/agate/Button';
import Header from '@enact/agate/Header';
import kind from '@enact/core/kind';

const HeaderView = kind({
	name: 'HeaderView',

	render: () => (
		<Header id="header" showLine subtitle="This is a subtitle" title="This is a title">
			<Button icon="home" />
		</Header>
	)
});

export default HeaderView;
