/* eslint-disable no-undef */
const {findFocusedNode} = require('../utils');

describe('Button a11y', () => {
	it('should have role `button` and correct name', async () => {
		await page.goto('http://localhost:8080/buttonA11y');
		await page.waitForSelector('#button');

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);

		expect(node.role).toEqual('button');
		expect(node.name).toEqual('Hello World!');
	});

	it('iconButton should have role `button` and correct name', async () => {
		await page.goto('http://localhost:8080/buttonA11y');
		await page.waitForSelector('#iconOnlyButton');
		await page.keyboard.down('ArrowRight');
		await page.waitForTimeout(500);
		await page.keyboard.up('ArrowRight');
		await page.waitForTimeout(500);

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);

		expect(node.role).toEqual('button');
		expect(node.name).toEqual('search');
	});
});

