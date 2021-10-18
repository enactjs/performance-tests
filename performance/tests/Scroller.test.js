const TestResults = require('../TestResults');
const {CLS, FID, FPS, getAverageFPS, LoadingMetrics} = require('../TraceModel');
const {clsValue, firstInputValue, getFileName, scrollAtPoint} = require('../utils');

describe( 'Scroller', () => {
	const component = 'Scroller';
	TestResults.newFile(component);

	describe('keypress', () => {
		it('scrolls down', async () => {
			await FPS();
			await page.goto('http://localhost:8080/scroller');
			await page.focus('[aria-label="scroll up or down with up down button"]');
			await page.keyboard.down('Enter');
			await page.keyboard.down('Enter');
			await page.waitForTimeout(2000);

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'Frames Per Second Click', actualValue: averageFPS});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	describe('mouse wheel', () => {
		it('scrolls down', async () => {
			await FPS();
			await page.goto('http://localhost:8080/scroller');
			const scroller = '#scroller';

			await scrollAtPoint(page, scroller, 1000);
			await page.waitForTimeout(200);
			await scrollAtPoint(page, scroller, 1000);
			await page.waitForTimeout(200);
			await scrollAtPoint(page, scroller, 1000);
			await page.waitForTimeout(200);
			await scrollAtPoint(page, scroller, 1000);
			await page.waitForTimeout(200);

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'Frames Per Second Keypress', actualValue: averageFPS});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	it('should have a good FID and CLS', async () => {
		await page.evaluateOnNewDocument(FID);
		await page.evaluateOnNewDocument(CLS);
		await page.goto('http://localhost:8080/scroller');
		await page.waitForSelector('#scroller');
		await page.focus('[aria-label="scroll up or down with up down button"]');
		await page.keyboard.down('Enter');
		await page.keyboard.down('Enter');
		await page.waitForTimeout(2000);

		let actualFirstInput = await firstInputValue();
		let actualCLS = await clsValue();

		TestResults.addResult({component: component, type: 'First Input Delay', actualValue: actualFirstInput});
		TestResults.addResult({component: component, type: 'CLS', actualValue: actualCLS});

		expect(actualFirstInput).toBeLessThan(maxFID);
		expect(actualCLS).toBeLessThan(maxCLS);
	});

	it('should have a good DCL, FCP and LCP', async () => {
		const filename = getFileName(component);

		let passContDCL = 0;
		let passContFCP = 0;
		let passContLCP = 0;
		let avgDCL = 0;
		let avgFCP = 0;
		let avgLCP = 0;
		for (let step = 0; step < stepNumber; step++) {
			const page = await testMultiple.newPage();

			await page.tracing.start({path: filename, screenshots: false});
			await page.goto('http://localhost:8080/scroller');
			await page.waitForSelector('#scroller');
			await page.waitForTimeout(200);

			await page.tracing.stop();

			const {actualDCL, actualFCP, actualLCP} = LoadingMetrics(filename);
			avgDCL = avgDCL + actualDCL;
			if (actualDCL < maxDCL) {
				passContDCL += 1;
			}

			avgFCP = avgFCP + actualFCP;
			if (actualFCP < maxFCP) {
				passContFCP += 1;
			}

			avgLCP = avgLCP + actualLCP;
			if (actualLCP < maxLCP) {
				passContLCP += 1;
			}

			await page.close();
		}
		avgDCL = avgDCL / stepNumber;
		avgFCP = avgFCP / stepNumber;
		avgLCP = avgLCP / stepNumber;

		TestResults.addResult({component: component, type: 'average DCL', actualValue: avgDCL});
		TestResults.addResult({component: component, type: 'average FCP', actualValue: avgFCP});
		TestResults.addResult({component: component, type: 'average LCP', actualValue: avgLCP});

		expect(passContDCL).toBeGreaterThan(passRatio * stepNumber);
		expect(avgDCL).toBeLessThan(maxDCL);

		expect(passContFCP).toBeGreaterThan(passRatio * stepNumber);
		expect(avgFCP).toBeLessThan(maxFCP);

		expect(passContLCP).toBeGreaterThan(passRatio * stepNumber);
		expect(avgLCP).toBeLessThan(maxLCP);
	});

	it('scroll down with 5-way with Scroller Native', async () => {
		await FPS();

		await page.goto('http://localhost:8080/scrollerMultipleChildren?count=100&type=ScrollerNative');
		await page.waitForSelector('#Scroller');
		await page.focus('#Scroller > div:first-child > div:first-child');

		for (let i = 0; i < 300; i++) {
			await page.keyboard.down('ArrowDown');
			await page.waitForTimeout(10);
		}

		await page.waitForTimeout(1000);

		const averageFPS = await getAverageFPS();
		TestResults.addResult({component: component, type: 'Scroller Native Frames Per Second', actualValue: averageFPS});
	});
});
