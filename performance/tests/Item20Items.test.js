/* global page, maxCLS, stepNumber, testMultiple, maxDCL, maxFCP, maxLCP, passRatio */

const TestResults = require('../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../TraceModel');
const {clsValue, firstInputValue, getFileName, scrollAtPoint} = require('../utils');

describe('Item20Items', () => {
	const component = 'Item20Items';
	TestResults.newFile(component);

	describe('ScrollButton', () => {
		it('scrolls down', async () => {
			await FPS();
			await page.goto('http://localhost:8080/item20Items');
			await page.waitForSelector('#item');
			await page.focus('#item');
			await page.keyboard.down('ArrowDown');
			await page.waitForTimeout(200);
			await page.keyboard.down('ArrowDown');
			await page.waitForTimeout(200);
			await page.keyboard.down('ArrowDown');
			await page.waitForTimeout(200);
			await page.keyboard.down('ArrowDown');
			await page.waitForTimeout(2000);

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Keypress', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	})

	describe('mousewheel', () => {
		it('scrolls down', async () => {
			await FPS();
			const itemId = '#item';

			await page.goto('http://localhost:8080/item20Items');
			await page.focus('#item');
			await page.waitForSelector(itemId);
			await scrollAtPoint(page, itemId, 1000);
			await page.waitForTimeout(200);
			await scrollAtPoint(page, itemId, 1000);
			await page.waitForTimeout(200);
			await scrollAtPoint(page, itemId, 1000);
			await page.waitForTimeout(200);
			await scrollAtPoint(page, itemId, 1000);
			await page.waitForTimeout(200);

			const averageFPS = await getAverageFPS();
			TestResults.addResult({ component: component, type: 'FPS Mousewheel', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000 });

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	it('should have a good CLS and FID', async () => {
		await page.evaluateOnNewDocument(FID);
		await page.evaluateOnNewDocument(CLS);
		await page.goto('http://localhost:8080/item20Items');
		await page.waitForSelector('#item');
		await page.focus('#item');
		await page.keyboard.down('Enter');
		await page.waitForTimeout(200);

		let actualCLS = await clsValue();
		let actualFirstInput = await firstInputValue();

		TestResults.addResult({ component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000 });
		TestResults.addResult({component: component, type: 'FID', actualValue: Math.round((actualFirstInput + Number.EPSILON) * 1000) / 1000});

		expect(actualCLS).toBeLessThan(maxCLS);
		expect(actualFirstInput).toBeLessThan(maxFID);

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
			const itemPage = await testMultiple.newPage();

			await itemPage.tracing.start({ path: filename, screenshots: false });
			await itemPage.goto('http://localhost:8080/item20Items');
			await itemPage.waitForSelector('#item');
			await itemPage.waitForTimeout(200);

			await itemPage.tracing.stop();

			const { actualDCL, actualFCP, actualLCP } = PageLoadingMetrics(filename);
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

			await itemPage.close();
		}
		avgDCL = avgDCL / stepNumber;
		avgFCP = avgFCP / stepNumber;
		avgLCP = avgLCP / stepNumber;

		TestResults.addResult({ component: component, type: 'DCL', actualValue: Math.round((avgDCL + Number.EPSILON) * 1000) / 1000 });
		TestResults.addResult({ component: component, type: 'FCP', actualValue: Math.round((avgFCP + Number.EPSILON) * 1000) / 1000 });
		TestResults.addResult({ component: component, type: 'LCP', actualValue: Math.round((avgLCP + Number.EPSILON) * 1000) / 1000 });

		expect(passContDCL).toBeGreaterThan(passRatio * stepNumber);
		expect(avgDCL).toBeLessThan(maxDCL);

		expect(passContFCP).toBeGreaterThan(passRatio * stepNumber);
		expect(avgFCP).toBeLessThan(maxFCP);

		expect(passContLCP).toBeGreaterThan(passRatio * stepNumber);
		expect(avgLCP).toBeLessThan(maxLCP);
	});
});
