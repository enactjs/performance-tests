/* global CPUThrottling, page, minFPS, maxFID, maxCLS, stepNumber, maxDCL, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv */

'use strict';
const {PagePerformance} = require('@enact/ui-test-utils/utils');

class ArcPickerInterface {
	constructor (id) {
		this.id = id;
		this.selector = `#${this.id}`;
	}

	clickablePath (index) {
		return $(this.selector + ' svg[class*=enact_agate_ArcPicker_ArcPicker_arc]:nth-child(' + index + ') path:nth-child(2)');
	}
}

class ArcPickerPage extends PagePerformance {
	constructor () {
		super();
		this.title = 'ArcPicker Test';
		const arcPicker = new ArcPickerInterface('arcPicker');
		this.components = {arcPicker};
	}

	async open () {
		await super.open(`arcPicker`);
	}
}

module.exports = new ArcPickerPage();
