const {DCL, FCP, FPS} = require('../TraceModel');
const {getFileName} = require('../utils');
const TestResults = require('../TestResults');

describe('Button', () => {
	describe('click', () => {
		it('animates', async () => {
			const filename = getFileName('Button');
			await page.goto('http://localhost:8080/button');
			await page.tracing.start({path: filename, screenshots: false});
			await page.waitFor(500);

			await page.click('#button'); // to move mouse on the button.
			await page.mouse.down();
			await page.waitFor(200);
			await page.mouse.up();
			await page.mouse.down();
			await page.waitFor(200);
			await page.mouse.up();
			await page.mouse.down();
			await page.waitFor(200);
			await page.mouse.up();
			await page.mouse.down();
			await page.waitFor(200);
			await page.mouse.up();

			await page.tracing.stop();

			const actualFPS = FPS(filename);
			TestResults.addResult({component: 'Button', type: 'Frames Per Second', actualValue: actualFPS});
		});
	});

	describe('keypress', () => {
		it('animates', async () => {
			const filename = getFileName('Button');

			await page.goto('http://localhost:8080/button');
			await page.tracing.start({path: filename, screenshots: false});
			await page.waitForSelector('#button');
			await page.focus('#button');
			await page.waitFor(200);
			await page.keyboard.down('Enter');
			await page.waitFor(200);
			await page.keyboard.up('Enter');
			await page.keyboard.down('Enter');
			await page.waitFor(200);
			await page.keyboard.up('Enter');
			await page.keyboard.down('Enter');
			await page.waitFor(200);
			await page.keyboard.up('Enter');
			await page.keyboard.down('Enter');
			await page.waitFor(200);
			await page.keyboard.up('Enter');

			await page.tracing.stop();

			const actualFPS = FPS(filename);
			TestResults.addResult({component: 'Button', type: 'Frames Per Second', actualValue: actualFPS});
		});
	});

	it('should have a good FCP', async () => {
		const filename = getFileName('Button');

		await page.tracing.start({path: filename, screenshots: false});
		await page.goto('http://localhost:8080/button');
		await page.waitForSelector('#button');

		await page.tracing.stop();

		const actualFCP = await FCP(filename);
		TestResults.addResult({component: 'Button', type: 'FCP', actualValue: actualFCP});
	});

	it('should have a good DCL', async () => {
		const filename = getFileName('Button');

		await page.tracing.start({path: filename, screenshots: false});
		await page.goto('http://localhost:8080/button');
		await page.waitForSelector('#button');

		await page.tracing.stop();

		const actualDCL = await DCL(filename);
		TestResults.addResult({component: 'Button', type: 'DCL', actualValue: actualDCL});
	});
});

