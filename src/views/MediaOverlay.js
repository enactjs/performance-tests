import kind from '@enact/core/kind';
import MediaOverlay from '@enact/sandstone/MediaOverlay';

const MediaOverlayView = kind({
	name: 'MediaOverlayView',

	render: () => (
		<MediaOverlay
			caption="The quick brown fox jumped over the lazy dog. The bean bird flies at sundown."
			id="mediaOverlay"
			loop
			marqueeOn="render"
			muted
			progress={0.5}
			showProgress
			subtitle="The quick brown fox jumped over the lazy dog. The bean bird flies at sundown."
			text="The quick brown fox jumped over the lazy dog. The bean bird flies at sundown."
			title="The quick brown fox jumped over the lazy dog. The bean bird flies at sundown."
		>
			<source src="https://media.w3.org/2010/05/sintel/trailer.ogv" />
		</MediaOverlay>
	)
});

export default MediaOverlayView;
