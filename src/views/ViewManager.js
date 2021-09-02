import React from 'react';
import ViewManager, {SlideLeftArranger} from '@enact/ui/ViewManager';
import {Profiler} from 'react';

import {putRenderedMark} from '../utils';

class ViewManagerView extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			index: 0
		};
	}

	handleClick = () => this.setState(state => {
		return {index: state.index ? 0 : 1};
	});

	render () {
		return (
			<Profiler id="viewManager-rendered" onRender={putRenderedMark}>
				<ViewManager id="viewManager" index={this.state.index} onClick={this.handleClick} arranger={SlideLeftArranger}>
					<div id="view1" className="view">View 1</div>
					<div id="view2" className="view">View 2</div>
				</ViewManager>
			</Profiler>
		);
	}
}

export default ViewManagerView;
