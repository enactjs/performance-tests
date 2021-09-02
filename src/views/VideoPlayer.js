import kind from '@enact/core/kind';
import Button from '@enact/sandstone/Button';
import {MediaControls} from '@enact/sandstone/MediaPlayer';
import VideoPlayer from '@enact/sandstone/VideoPlayer';
import {Profiler} from 'react';

import {putRenderedMark} from '../utils';

const VideoPlayerView = kind({
	name: 'VideoPlayerView',

	render: () => (
		<Profiler id="videoPlayer-rendered" onRender={putRenderedMark}>
			<VideoPlayer
				id="videoPlayer"
				poster={'http://media.w3.org/2010/05/sintel/poster.png'}
				thumbnailSrc={'http://media.w3.org/2010/05/sintel/poster.png'}
				title={'Sandstone VideoPlayer Sample Video'}
				>
					<source src={'http://media.w3.org/2010/05/sintel/trailer.mp4'} />
					<infoComponents>
						A video about some things happening to and around some characters. Very exciting stuff.
					</infoComponents>
					<MediaControls
						jumpBackwardIcon={'jumpbackward'}
						jumpForwardIcon={'jumpforward'}
						pauseIcon={'pause'}
						playIcon={'play'}
					>
						<Button size="small" icon="list" />
						<Button size="small" icon="playspeed" />
						<Button size="small" icon="speakercenter" />
						<Button size="small" icon="miniplayer" />
						<Button size="small" icon="subtitle" />
					</MediaControls>
			</VideoPlayer>
		</Profiler>
	)
});

export default VideoPlayerView;
