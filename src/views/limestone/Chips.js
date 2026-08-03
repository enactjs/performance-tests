import kind from '@enact/core/kind';
import {Chips, Chip} from '@enact/limestone/Chips';

const handleDelete = () => {};

const deleteRight = {icon: 'closex', position: 'right', onDelete: handleDelete};
const deleteTop = {icon: 'closex', position: 'top', onDelete: handleDelete};
const deleteBottom = {icon: 'closex', position: 'bottom', onDelete: handleDelete};

const imageSize = 36;

const ChipsView = kind({
	name: 'ChipsView',

	render: () => (
		<Chips id="chips" orientation="horizontal">
			<Chip icon="home" checked imageSize={imageSize} deleteButton={deleteRight}>First</Chip>
			<Chip icon="list" imageSize={imageSize} deleteButton={deleteTop}>Second</Chip>
			<Chip icon="music" checked imageSize={imageSize} deleteButton={deleteBottom}>Third</Chip>
			<Chip icon="gear" disabled imageSize={imageSize} deleteButton={deleteRight}>Fourth</Chip>
		</Chips>
	)
});

export default ChipsView;
