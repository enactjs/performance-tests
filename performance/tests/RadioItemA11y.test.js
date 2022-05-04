/* eslint-disable no-undef */

const TestResults = require('../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../TraceModel');
const {clsValue, firstInputValue, getFileName, findFocusedNode} = require('../utils');

describe('RadioItem', () => {
	it('should have role `checkbox`', async () => {
		await page.goto('http://localhost:8080/radioItem');
		await page.waitForSelector('#radioItem');

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);

		expect(node.role).toEqual('checkbox');
		expect(node.name).toEqual('Hello RadioItem');
	});

	it('should be unchecked by default', async () => {
		await page.goto('http://localhost:8080/radioItem');
		await page.waitForSelector('#radioItem');

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);

		expect(node.checked).toBeFalsy();
	});

	it('should be checked on Enter', async () => {
		await page.goto('http://localhost:8080/radioItem');
		await page.waitForSelector('#radioItem');
		await page.keyboard.down('Enter');
		await page.waitForTimeout(200);
		await page.keyboard.up('Enter');

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);

		expect(node.checked).toBeTruthy();
	});

	it('should be checked on click', async () => {
		await page.goto('http://localhost:8080/radioItem');
		await page.waitForSelector('#radioItem');
		await page.click('#radioItem');

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);

		expect(node.checked).toBeTruthy();
		expect(node.name).toEqual('Hello RadioItem');
	});
});
