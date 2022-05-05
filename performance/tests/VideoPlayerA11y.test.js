/* eslint-disable no-undef */
const {findFocusedNode} = require('../utils');

describe('VideoPlayer a11y', () => {
	it('should have role `button` and correct name `pause`', async () => {
		await page.goto('http://localhost:8080/videoPlayerA11y');
		await page.waitForSelector('#videoPlayer');
		await page.waitForTimeout(1000);
		await page.focus('[aria-label="Pause"]');
		await page.waitForTimeout(200);

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);

		expect(node.role).toEqual('button');
		expect(node.name).toEqual('Pause');
	});

	it('should have role `button` and correct name `next`', async () => {
		await page.goto('http://localhost:8080/videoPlayerA11y');
		await page.waitForSelector('#videoPlayer');
		await page.waitForTimeout(1000);
		await page.focus('[aria-label="Next"]');
		await page.waitForTimeout(200);

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);

		expect(node.role).toEqual('button');
		expect(node.name).toEqual('Next');
	});

	it('should have role `button` and correct name `previous`', async () => {
		await page.goto('http://localhost:8080/videoPlayerA11y');
		await page.waitForSelector('#videoPlayer');
		await page.waitForTimeout(1000);
		await page.focus('[aria-label="Previous"]');
		await page.waitForTimeout(200);

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);

		expect(node.role).toEqual('button');
		expect(node.name).toEqual('Previous');
	});

	it('should have role `button` and correct name `Play` after enter', async () => {
		await page.goto('http://localhost:8080/videoPlayerA11y');
		await page.waitForSelector('#videoPlayer');
		await page.waitForTimeout(1000);
		await page.focus('[aria-label="Pause"]');
		await page.waitForTimeout(200);
		await page.keyboard.down('Enter');
		await page.waitForTimeout(500);
		await page.keyboard.up('Enter');
		await page.waitForTimeout(500);

		const snapshot = await page.accessibility.snapshot();
		const node = await findFocusedNode(snapshot);

		expect(node.role).toEqual('button');
		expect(node.name).toEqual('Play');
	});

	// TODO: focus slider
	// it('should have spotlight on slider', async () => {
	// 	await page.goto('http://localhost:8080/videoPlayerA11y');
	// 	await page.waitForSelector('#videoPlayer');
	// 	await page.waitForTimeout(3000);
	// 	await page.focus('[aria-label="Pause"]');
	// 	await page.waitForTimeout(200);
	// 	await page.keyboard.down('ArrowUp');
	// 	await page.waitForTimeout(500);
	// 	await page.keyboard.up('ArrowUp');
	// 	await page.waitForTimeout(500);
	//
	// 	const snapshot = await page.accessibility.snapshot();
	// 	const node = await findFocusedNode(snapshot);
	// 	console.log(node);
	//
	// 	expect(node.role).toEqual('slider');
	// 	expect(node.name).toEqual('Play');
	// });
});
