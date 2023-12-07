import ThumbnailItem from '@enact/agate/ThumbnailItem';
import kind from '@enact/core/kind';

const ThumbnailItemView = kind({
	name: 'ThumbnailItemView',

	render: () => (
		<ThumbnailItem
			id="thumbnailItem"
			src="https://dummyimage.com/64/e048e0/0011ff"
		>
			Thumbnail Item default
		</ThumbnailItem>
	)
});

export default ThumbnailItemView;
