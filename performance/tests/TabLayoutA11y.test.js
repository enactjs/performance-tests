/* eslint-disable no-undef */
const {findFocusedNode} = require('../utils');

describe('TabLayout A11y', () => {
	it('should have correct `Tab1` name', async () => {
		await page.goto('http://localhost:8080/tabLayout');
		await page.waitForSelector('#tabLayout');

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);

		expect(node.name).toEqual('Tab1');
	});

	it('should have correct name when focusing ImageItem in Tab1', async () => {
		await page.goto('http://localhost:8080/tabLayout');
		await page.waitForSelector('#tabLayout');
		await page.waitForTimeout(1000);
		await page.keyboard.down('ArrowRight');
		await page.waitForTimeout(200);
		await page.keyboard.up('ArrowRight');
		await page.waitForTimeout(200);

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);

		expect(node.name).toEqual('ImageItem 1 ImageItem label');
	});

	it('should have correct `Tab2` name', async () => {
		await page.goto('http://localhost:8080/tabLayout');
		await page.waitForSelector('#tabLayout');
		await page.waitForTimeout(1000);
		await page.keyboard.down('ArrowDown');
		await page.waitForTimeout(200);
		await page.keyboard.up('ArrowDown');
		await page.waitForTimeout(200);

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);

		expect(node.name).toEqual('Tab2');
	});

	it('should have correct name for Button in Tab2', async () => {
		await page.goto('http://localhost:8080/tabLayout');
		await page.waitForSelector('#tabLayout');
		await page.waitForTimeout(1000);
		await page.keyboard.down('ArrowDown');
		await page.waitForTimeout(200);
		await page.keyboard.up('ArrowDown');
		await page.waitForTimeout(200);
		await page.keyboard.down('ArrowRight');
		await page.waitForTimeout(200);
		await page.keyboard.up('ArrowRight');
		await page.waitForTimeout(200);

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);

		expect(node.name).toEqual('Button 1');
	});

	it('should have correct `Tab2` name', async () => {
		await page.goto('http://localhost:8080/tabLayout');
		await page.waitForSelector('#tabLayout');
		await page.waitForTimeout(1000);
		await page.keyboard.down('ArrowDown');
		await page.waitForTimeout(200);
		await page.keyboard.up('ArrowDown');
		await page.waitForTimeout(200);
		await page.keyboard.down('ArrowDown');
		await page.waitForTimeout(200);
		await page.keyboard.up('ArrowDown');
		await page.waitForTimeout(200);

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);

		expect(node.name).toEqual('Tab3');
	});

	it('shpuld have correct name for Item in Tab3', async () => {
		await page.goto('http://localhost:8080/tabLayout');
		await page.waitForSelector('#tabLayout');
		await page.waitForTimeout(1000);
		await page.keyboard.down('ArrowDown');
		await page.waitForTimeout(200);
		await page.keyboard.up('ArrowDown');
		await page.waitForTimeout(200);
		await page.keyboard.down('ArrowDown');
		await page.waitForTimeout(200);
		await page.keyboard.up('ArrowDown');
		await page.waitForTimeout(200);
		await page.keyboard.down('ArrowRight');
		await page.waitForTimeout(200);
		await page.keyboard.up('ArrowRight');
		await page.waitForTimeout(200);

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);

		expect(node.name).toEqual('Single Item');
	});
});
