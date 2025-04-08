import kind from '@enact/core/kind';
import Picker from '@enact/limestone/Picker';

const PickerJoinedView = kind({
	name: 'PickerJoinedView',

	render: () => (
		<Picker
			id="pickerJoined"
			joined
			title="Picker Joined"
			width="large"
		>
			{[
				'San Francisco International Airport Terminal 1',
				'Milan Malpensa Airport Terminal 2',
				'Paris-Charles De Gaulle Airport Terminal 3',
				'Boston Logan Airport Terminal D',
				'Tokyo Narita Airport Terminal 5',
				'Heathrow Terminal 6',
				'נמל התעופה בן גוריון טרמינל הבינלאומי'
			]}
		</Picker>
	)
});

export default PickerJoinedView;
