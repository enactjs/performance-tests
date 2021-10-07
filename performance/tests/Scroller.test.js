const {CLS, DCL, FCP, FID, FPS, LCP} = require('../TraceModel');
const {getFileName, scrollAtPoint} = require('../utils');
const TestResults = require('../TestResults');

describe( 'Scroller', () => {
	const component = 'Scroller';
	TestResults.newFile(component);

	describe('keypress', () => {
		it('scrolls down', async () => {
			const FPSValues = await FPS();
			await page.goto('http://localhost:8080/scroller');
			await page.focus('[aria-label="scroll up or down with up down button"]');
			await page.keyboard.down('Enter');
			await page.keyboard.down('Enter');
			await page.waitForTimeout(2000);

			const averageFPS = (FPSValues.reduce((a, b) => a + b, 0) / FPSValues.length) || 0;
			TestResults.addResult({component: component, type: 'Frames Per Second Click', actualValue: averageFPS});
		});
	});

	describe('mouse wheel', () => {
		it('scrolls down', async () => {
			const FPSValues = await FPS();
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

			const averageFPS = (FPSValues.reduce((a, b) => a + b, 0) / FPSValues.length) || 0;
			TestResults.addResult({component: component, type: 'Frames Per Second Keypress', actualValue: averageFPS});
		});
	});

	it('should have a good DCL, FCP and LCP', async () => {
		const filename = getFileName(component);

		let contDCL = 0;
		let contFCP = 0;
		let contLCP = 0;
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

			const actualDCL = await DCL(filename);
			avgDCL = avgDCL + actualDCL;
			if (actualDCL < maxDCL) {
				contDCL += 1;
			}

			const actualFCP = await FCP(filename);
			avgFCP = avgFCP + actualFCP;
			if (actualFCP < maxFCP) {
				contFCP += 1;
			}

			const actualLCP = await LCP(filename);
			avgLCP = avgLCP + actualLCP;
			if (actualLCP < maxLCP) {
				contLCP += 1;
			}

			await page.close();
		}
		avgDCL = avgDCL / stepNumber;
		avgFCP = avgFCP / stepNumber;
		avgLCP = avgLCP / stepNumber;

		TestResults.addResult({component: component, type: 'average DCL', actualValue: avgDCL});
		expect(contDCL).toBeGreaterThan(percent);
		expect(avgDCL).toBeLessThan(maxDCL);

		TestResults.addResult({component: component, type: 'average FCP', actualValue: avgFCP});
		expect(contFCP).toBeGreaterThan(percent);
		expect(avgFCP).toBeLessThan(maxFCP);

		TestResults.addResult({component: component, type: 'average LCP', actualValue: avgLCP});
		expect(contLCP).toBeGreaterThan(percent);
		expect(avgLCP).toBeLessThan(maxLCP);
	});

	it('scroll down with 5-way with Scroller Native', async () => {
		const FPSValues = await FPS();

		await page.goto('http://localhost:8080/scrollerMultipleChildren?count=100&type=ScrollerNative');
		await page.waitForSelector('#Scroller');
		await page.focus('#Scroller > div:first-child > div:first-child');

		for (let i = 0; i < 300; i++) {
			await page.keyboard.down('ArrowDown');
			await page.waitForTimeout(10);
		}

		await page.waitForTimeout(1000);

		const averageFPS = (FPSValues.reduce((a, b) => a + b, 0) / FPSValues.length) || 0;
		TestResults.addResult({component: component, type: 'SCroller Native Frames Per Second', actualValue: averageFPS});
	});
});
