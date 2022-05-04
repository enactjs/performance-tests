/* eslint-disable no-undef */

const TestResults = require('../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../TraceModel');
const {clsValue, firstInputValue, getFileName, findFocusedNode} = require('../utils');

describe('DatePicker', () => {
	it('should have role `checkbox`', async () => {
		await page.goto('http://localhost:8080/datePicker');
		//await page.waitForSelector('#datePicker');
		await page.click('[data-webos-voice-group-label="month"]'); // to move mouse on the increment button.

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);
console.log(snapshot)
		expect(node.role).toEqual('checkbox');
		expect(node.name).toEqual('Hello RadioItem');
	});

});

