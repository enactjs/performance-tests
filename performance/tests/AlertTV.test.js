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

			// pageTV.goto('http://localhost:9998/')
			await pageTV.goto('http://10.178.92.42:8080');
			await pageTV.setViewport({
				width: 1920,
				height: 1080
			});
			console.log(platform.detect());

			await pageTV.waitForTimeout(20000);
		});
	});
});
