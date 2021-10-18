const TestResults = require('../TestResults');
const {CLS, FID, FPS, LoadingMetrics} = require('../TraceModel');
const {clsValue, firstInputValue, getFileName, scrollAtPoint} = require('../utils');

describe('VirtualList', () => {
	const component = 'VirtualList';
	TestResults.newFile(component);

	describe('ScrollButton', () => {
		it('scrolls down', async () => {
			await FPS();
			await page.goto('http://localhost:8080/virtualList');
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

			const averageFPS = (FPSValues.reduce((a, b) => a + b, 0) / FPSValues.length) || 0;
			TestResults.addResult({component: component, type: 'Frames Per Second Keypress', actualValue: averageFPS});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	describe('mousewheel', () => {
		it('scrolls down', async () => {
			await FPS();
			const VirtualList = '#virtualList';

			await page.goto('http://localhost:8080/virtualList');
			await page.waitForSelector(VirtualList);
			await scrollAtPoint(page, VirtualList, 1000);
			await page.waitForTimeout(200);
			await scrollAtPoint(page, VirtualList, 1000);
			await page.waitForTimeout(200);
			await scrollAtPoint(page, VirtualList, 1000);
			await page.waitForTimeout(200);
			await scrollAtPoint(page, VirtualList, 1000);
			await page.waitForTimeout(200);

			const averageFPS = (FPSValues.reduce((a, b) => a + b, 0) / FPSValues.length) || 0;
			TestResults.addResult({component: component, type: 'Frames Per Second Mousewheel', actualValue: averageFPS});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	it('should have a good FID and CLS', async () => {
		await page.evaluateOnNewDocument(FID);
		await page.evaluateOnNewDocument(CLS);
		await page.goto('http://localhost:8080/virtualList');
		await page.waitForSelector('#virtualList');
		await page.focus('#virtualList');
		await page.keyboard.down('Enter');

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
			await page.goto('http://localhost:8080/virtualList');
			await page.waitForSelector('#virtualList');
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
});
