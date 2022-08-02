/* global page, minFPS, maxFID, maxFID, stepNumber, testMultiple, maxDCL, maxFCP, maxLCP, maxCLS, passRatio */

const TestResults = require('../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../TraceModel');
const {clsValue, firstInputValue, getFileName} = require('../utils');
const platform = require("@enact/webos/platform");

describe('Alert', () => {
	const component = 'Alert';
	TestResults.newFile(component);

	describe('click', () => {
		it('animates', async () => {

			pageTV.goto('http://localhost:9998/')
			console.log(platform.detect());

			await pageTV.waitForTimeout(20000);
		});
	});
});
