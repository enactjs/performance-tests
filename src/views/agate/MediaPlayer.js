import MediaPlayer from '@enact/agate/MediaPlayer';
import kind from '@enact/core/kind';

const audioFiles = [
	'https://sampleswap.org/mp3/artist/254731/BossPlayer_Your-Right-Here-160.mp3',
	'https://sampleswap.org/mp3/artist/78152/HiatusManJBanner_Show-Stopper-160.mp3',
	'https://sampleswap.org/mp3/artist/47067/DJ-Masque_Oceanic-Dawn-160.mp3',
	'https://sampleswap.org/mp3/artist/26546/benzoul_lovevoodoo-160.mp3',
	'https://sampleswap.org/mp3/artist/19139/MarkNine_In-my-Place-160.mp3',
	'https://sampleswap.org/mp3/artist/47067/DJ-Masque_Dont-Forget-To-Be-Yourself-160.mp3'
];

const MediaPlayerView = kind({
	name: 'MediaPlayerView',

	render: () => (
		<MediaPlayer id="agate-mediaPlayer" source={[]}>
			{
				audioFiles.map((audioFile, index) => (<source key={index} src={audioFile} type="audio/mp3" />))
			}
		</MediaPlayer>
	)
});

export default MediaPlayerView;
