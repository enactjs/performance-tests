const getCustomMetrics = require('../ProfilerMetrics');
const {DCL, FCP, FPS} = require('../TraceModel');
const {getFileName, scrollAtPoint} = require('../utils');
const TestResults = require('../TestResults');

describe( 'Scroller', () => {
	const component = 'Scroller';
	TestResults.emptyFile(component);

	describe('keypress', () => {
		it('scrolls down', async () => {
			const filename = getFileName('Scroller');
			await page.goto('http://localhost:8080/scroller');
			await page.tracing.start({path: filename, screenshots: false});

			await page.focus('[aria-label="scroll up or down with up down button"]');
			await page.keyboard.down('Enter');
			await page.keyboard.down('Enter');
			await page.waitForTimeout(2000);

			await page.tracing.stop();

			const actual = FPS(filename);
			TestResults.addResult({component: 'Scroller', type: 'Frames Per Second', actualValue: actual});

			const actualUpdateTime = (await getCustomMetrics(page))['update'];
			TestResults.addResult({component: component, type: 'average Update Time', actualValue: actualUpdateTime});
		});
	});

	describe('mouse wheel', () => {
		it('scrolls down', async () => {
			const filename = getFileName('Scroller');
			await page.goto('http://localhost:8080/scroller');
			await page.tracing.start({path: filename, screenshots: false});

			const scroller = '#scroller';

			await scrollAtPoint(page, scroller, 1000);
			await page.waitForTimeout(200);
			await scrollAtPoint(page, scroller, 1000);
			await page.waitForTimeout(200);
			await scrollAtPoint(page, scroller, 1000);
			await page.waitForTimeout(200);
			await scrollAtPoint(page, scroller, 1000);
			await page.waitForTimeout(200);

			await page.tracing.stop();

			const actual = FPS(filename);
			TestResults.addResult({component: 'Scroller', type: 'Frames Per Second', actualValue: actual});

			const actualUpdateTime = (await getCustomMetrics(page))['update'];
			TestResults.addResult({component: component, type: 'average Update Time', actualValue: actualUpdateTime});
		});
	});

	it('mount time', async () => {
		const filename = getFileName(component);

		await page.goto('http://localhost:8080/scroller');
		await page.tracing.start({path: filename, screenshots: false});
		await page.waitForSelector('#scroller');

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
			await FCPPage.goto('http://localhost:8080/scroller');
			await FCPPage.waitForSelector('#scroller');
			await FCPPage.waitForTimeout(200);

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
			await DCLPage.goto('http://localhost:8080/scroller');
			await DCLPage.waitForSelector('#scroller');
			await DCLPage.waitForTimeout(200);

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
					await page.waitForTimeout(2000);

					await page.tracing.stop();

					const actualMountTime = (await getCustomMetrics(page))['mount'];
					TestResults.addResult({component: component, type: `Mount ${count} ${type}`, actualValue: actualMountTime});
				});
			}
		}
	});

	it('scroll down with 5-way with Scroller Native', async () => {
		const filename = getFileName(component);

		await page.tracing.start({path: filename, screenshots: true});
		await page.goto('http://localhost:8080/scrollerMultipleChildren?count=100&type=ScrollerNative');
		await page.waitForSelector('#Scroller');
		await page.focus('#Scroller > div:first-child > div:first-child');

		for (let i = 0; i < 300; i++) {
			await page.keyboard.down('ArrowDown');
			await page.waitForTimeout(10);
		}

		await page.waitForTimeout(1000);

		await page.tracing.stop();

		const actual = FPS(filename);
		TestResults.addResult({component: 'Scroller', type: 'FPS', actualValue: actual});
	});
});
