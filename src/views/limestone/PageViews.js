import kind from '@enact/core/kind';
import BodyText from '@enact/limestone/BodyText';
import PageViews from '@enact/limestone/PageViews';

const PageViewsView = kind({
	name: 'PageViewsView',

	render: () => (
		<PageViews id="pageViews">
			<PageViews.Page aria-label="First page">
				<BodyText>First page content</BodyText>
			</PageViews.Page>
			<PageViews.Page aria-label="Second page">
				<BodyText>Second page content</BodyText>
			</PageViews.Page>
			<PageViews.Page aria-label="Third page">
				<BodyText>Third page content</BodyText>
			</PageViews.Page>
		</PageViews>
	)
});

export default PageViewsView;
