const getCustomMetrics = require('../ProfilerMetrics');
const {DCL, FCP, FPS} = require('../TraceModel');
const {getFileName, scrollAtPoint} = require('../utils');
const TestResults = require('../TestResults');

describe( 'Scroller', () => {
	describe('ScrollButton', () => {
		it('scrolls down', async () => {
			const filename = getFileName('Scroller');
			await page.goto('http://localhost:8080/scroller');
			await page.tracing.start({path: filename, screenshots: false});

			await page.focus('[aria-label="scroll down"]');
			await page.keyboard.down('Enter');
			await page.keyboard.down('Enter');
			await page.waitFor(2000);

			await page.tracing.stop();

			const actual = FPS(filename);
			TestResults.addResult({component: 'Scroller', type: 'Frames Per Second', actualValue: actual});
		});
	});

	describe('mouse wheel', () => {
		it('scrolls down', async () => {
			const filename = getFileName('Scroller');
			await page.goto('http://localhost:8080/scroller');
			await page.tracing.start({path: filename, screenshots: false});

			const scroller = '#scroller';

			await scrollAtPoint(page, scroller, 1000);
			await page.waitFor(200);
			await scrollAtPoint(page, scroller, 1000);
			await page.waitFor(200);
			await scrollAtPoint(page, scroller, 1000);
			await page.waitFor(200);
			await scrollAtPoint(page, scroller, 1000);
			await page.waitFor(200);

			await page.tracing.stop();

			const actual = FPS(filename);
			TestResults.addResult({component: 'Scroller', type: 'Frames Per Second', actualValue: actual});
		});
	});

	it('mount time', async () => {
		const filename = getFileName(component);

		await page.goto('http://localhost:8080/switchItem');
		await page.tracing.start({path: filename, screenshots: false});
		await page.waitForSelector('#switchItem');

		await page.tracing.stop();

		const actualMountTime = (await getCustomMetrics(page))['mount'];
		TestResults.addResult({component: component, type: 'Mount Time', actualValue: actualMountTime});
	});


	it('should have a good FCP', async () => {
		const filename = getFileName(component);

		let cont = 0;
		let avg = 0;
		for (let step = 0; step < stepNumber; step++) {
			const FCPPage = await testMultiple.newPage();

			await FCPPage.tracing.start({path: filename, screenshots: false});
			await FCPPage.goto('http://localhost:8080/switchItem');
			await FCPPage.waitForSelector('#switchItem');

			await FCPPage.tracing.stop();

			const actualFCP = await FCP(filename);
			avg = avg + actualFCP;

			if (actualFCP < maxFCP) {
				cont += 1;
			}
			await FCPPage.close();
		}
		avg = avg / stepNumber;

		TestResults.addResult({component: component, type: 'average FCP', actualValue: avg});

		expect(cont).toBeGreaterThan(percent);
		expect(avg).toBeLessThan(maxFCP);
	});

	it('should have a good DCL', async () => {
		const filename = getFileName(component);

		let cont = 0;
		let avg = 0;
		for (let step = 0; step < stepNumber; step++) {
			const DCLPage = await testMultiple.newPage();
			await DCLPage.tracing.start({path: filename, screenshots: false});
			await DCLPage.goto('http://localhost:8080/switchItem');
			await DCLPage.waitForSelector('#switchItem');

			await DCLPage.tracing.stop();

			const actualDCL = await DCL(filename);
			avg = avg + actualDCL;

			if (actualDCL < maxDCL) {
				cont += 1;
			}
			await DCLPage.close();
		}
		avg = avg / stepNumber;

		TestResults.addResult({component: component, type: 'average DCL', actualValue: avg});

		expect(cont).toBeGreaterThan(percent);
		expect(avg).toBeLessThan(maxDCL);
	});

	describe('mount with various children', () => {

		const counts = [10, 40, 70, 100];
		let results = [];
		const types = [
			'ScrollerJS',
			'UiScrollerJS'
		];

		for (const type of types) {
			for (let index = 0; index < counts.length; index++) {
				const count = counts[index];
				it(`mount ${type} with ${count} children`, async () => {
					const filename = getFileName(type);

					await page.tracing.start({path: filename, screenshots: false});
					await page.goto(`http://localhost:8080/scrollerMultipleChildren?count=${count}&type=${type}`);
					await page.waitFor(2000);

					await page.tracing.stop();

					const actual = Mount(filename, 'ScrollerMultipleChildren');
					results.push({count: count, value: actual, type: type});
					TestResults.addResult({component: 'Scroller', type: `Mount ${count} ${type}`, actualValue: actual});

					const actualMountTime = (await getCustomMetrics(page))['mount'];
					TestResults.addResult({component: component, type: 'Mount Time', actualValue: actualMountTime});
				});
			}
		}
	});


	it('scroll down with 5-way with Scroller Native', async () => {
		const filename = getFileName('ScrollerNative');

		await page.tracing.start({path: filename, screenshots: false});
		await page.goto('http://localhost:8080/scrollerMultipleChildren?count=100&type=ScrollerNative');
		await page.waitForSelector('#Scroller');
		const item = '[class^="Item_item"]';
		await page.focus(item);

		for (let i = 0; i < 300; i++) {
			await page.keyboard.down('ArrowDown');
			await page.waitFor(10);
		}

		await page.waitFor(2000);

		await page.tracing.stop();

		const actual = FPS(filename);
		TestResults.addResult({component: 'Scroller', type: 'FPS', actualValue: actual});
	});
});
