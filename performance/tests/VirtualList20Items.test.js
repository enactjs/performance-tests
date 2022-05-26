/* global page, minFPS, maxFID, maxCLS, stepNumber, testMultiple, maxDCL, maxFCP, maxLCP, passRatio */

const TestResults = require('../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../TraceModel');
const {clsValue, firstInputValue, getFileName, scrollAtPoint} = require('../utils');

describe('VirtualList20Items', () => {
	const component = 'VirtualList20Items';
	TestResults.newFile(component);

	describe('ScrollButton', () => {
		it('scrolls down', async () => {
			await FPS();
			await page.goto('http://localhost:8080/virtualList20Items');
			await page.waitForSelector('#virtualList');
			await page.focus('[aria-label="scroll up or down with up down button"]');
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
	});

	describe('mousewheel', () => {
		it('scrolls down', async () => {
			await FPS();
			const VirtualList20Items = '#virtualList';

			await page.goto('http://localhost:8080/virtualList20Items');
			await page.waitForSelector(VirtualList20Items);
			await scrollAtPoint(page, VirtualList20Items, 1000);
			await page.waitForTimeout(200);
			await scrollAtPoint(page, VirtualList20Items, 1000);
			await page.waitForTimeout(200);
			await scrollAtPoint(page, VirtualList20Items, 1000);
			await page.waitForTimeout(200);
			await scrollAtPoint(page, VirtualList20Items, 1000);
			await page.waitForTimeout(200);

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Mousewheel', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	it('should have a good FID and CLS', async () => {
		await page.evaluateOnNewDocument(FID);
		await page.evaluateOnNewDocument(CLS);
		await page.goto('http://localhost:8080/virtualList20Items');
		await page.waitForSelector('#virtualList');
		await page.focus('#virtualList');
		await page.keyboard.down('Enter');

		let actualFirstInput = await firstInputValue();
		let actualCLS = await clsValue();

		TestResults.addResult({component: component, type: 'FID', actualValue: Math.round((actualFirstInput + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

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
			const virtualListPage = await testMultiple.newPage();

			await virtualListPage.tracing.start({path: filename, screenshots: false});
			await virtualListPage.goto('http://localhost:8080/virtualList20Items');
			await virtualListPage.waitForSelector('#virtualList');
			await virtualListPage.waitForTimeout(200);

			await virtualListPage.tracing.stop();

			const {actualDCL, actualFCP, actualLCP} = PageLoadingMetrics(filename);
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

			await virtualListPage.close();
		}
		avgDCL = avgDCL / stepNumber;
		avgFCP = avgFCP / stepNumber;
		avgLCP = avgLCP / stepNumber;

		TestResults.addResult({component: component, type: 'DCL', actualValue: Math.round((avgDCL + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'FCP', actualValue: Math.round((avgFCP + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'LCP', actualValue: Math.round((avgLCP + Number.EPSILON) * 1000) / 1000});

		expect(passContDCL).toBeGreaterThan(passRatio * stepNumber);
		expect(avgDCL).toBeLessThan(maxDCL);

		expect(passContFCP).toBeGreaterThan(passRatio * stepNumber);
		expect(avgFCP).toBeLessThan(maxFCP);

		expect(passContLCP).toBeGreaterThan(passRatio * stepNumber);
		expect(avgLCP).toBeLessThan(maxLCP);
	});
});
