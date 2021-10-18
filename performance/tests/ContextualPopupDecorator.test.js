const TestResults = require('../TestResults');
const {CLS, FPS, getAverageFPS, LoadingMetrics} = require('../TraceModel');
const {clsValue, getFileName} = require('../utils');

describe('ContextualPopupDecorator', () => {
	const component = 'ContextualPopupDecorator';
	TestResults.newFile(component);

	it('FPS', async () => {
		await FPS();
		await page.goto('http://localhost:8080/contextualPopupDecorator');
		await page.waitForSelector('#contextualPopupDecorator');
		await page.click('#contextualPopupDecorator'); // to move mouse on the button.
		await page.mouse.down();
		await page.waitForTimeout(100);
		await page.mouse.up();
		await page.mouse.down();
		await page.waitForTimeout(100);
		await page.mouse.up();
		await page.mouse.down();
		await page.waitForTimeout(100);
		await page.mouse.up();
		await page.mouse.down();
		await page.waitForTimeout(100);
		await page.mouse.up();

		const averageFPS = await getAverageFPS();
		TestResults.addResult({component: component, type: 'Frames Per Second', actualValue: averageFPS});

		expect(averageFPS).toBeGreaterThan(minFPS);
	});

	it('should have a good CLS', async () => {
		await page.evaluateOnNewDocument(CLS);
		await page.goto('http://localhost:8080/contextualPopupDecorator');
		await page.waitForTimeout(200);
		await page.waitForSelector('#contextualPopupDecorator');
		await page.click('#contextualPopupDecorator');

		let actualCLS = await clsValue();

		TestResults.addResult({component: component, type: 'CLS', actualValue: actualCLS});

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
			await page.goto('http://localhost:8080/contextualPopupDecorator');
			await page.waitForSelector('#contextualPopupDecorator');
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
