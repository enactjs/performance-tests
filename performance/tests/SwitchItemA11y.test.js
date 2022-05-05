/* eslint-disable no-undef */
const {findFocusedNode} = require('../utils');

describe('SwitchItem A11y', () => {
	it('should have correct name and `false` pressed value', async () => {
		await page.goto('http://localhost:8080/switchItemA11y');
		await page.waitForSelector('#switchItem');
		await page.focus('#switchItem');
		await page.waitForTimeout(1000);
		await page.keyboard.down('ArrowDown');
		await page.waitForTimeout(500);
		await page.keyboard.up('ArrowDown');
		await page.waitForTimeout(500);

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);

		expect(node.name).toEqual('Hello SwitchItem');
		expect(node.pressed).toEqual(false);
	});

	it('should have correct name and `true` pressed value', async () => {
		await page.goto('http://localhost:8080/switchItemA11y');
		await page.waitForSelector('#switchItem');
		await page.focus('#switchItem');
		await page.waitForTimeout(1000);
		await page.keyboard.down('ArrowDown');
		await page.waitForTimeout(500);
		await page.keyboard.up('ArrowDown');
		await page.waitForTimeout(500);
		await page.keyboard.down('Enter');
		await page.waitForTimeout(500);
		await page.keyboard.up('Enter');
		await page.waitForTimeout(500);

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);

		expect(node.name).toEqual('Hello SwitchItem');
		expect(node.pressed).toEqual(true);
	});
});
