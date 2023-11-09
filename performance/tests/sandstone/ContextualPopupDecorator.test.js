/* global CPUThrottling, page, minFPS, maxCLS, stepNumber, maxDCL, maxFCP, maxLCP, passRatio, serverAddr, targetEnv */

const TestResults = require('../../TestResults');
const {CLS, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, getFileName, newPageMultiple} = require('../../utils');

describe('ContextualPopupDecorator', () => {
	const component = 'ContextualPopupDecorator';
	TestResults.newFile(component);

	it('FPS', async () => {
		await FPS();
		await page.goto(`http://${serverAddr}/contextualPopupDecorator`);
		await page.waitForSelector('#contextualPopupDecorator');
		await page.click('#contextualPopupDecorator'); // to move mouse on the button.
		await page.mouse.down();
		await new Promise(r => setTimeout(r, 100));
		await page.mouse.up();
		await page.mouse.down();
		await new Promise(r => setTimeout(r, 100));
		await page.mouse.up();
		await page.mouse.down();
		await new Promise(r => setTimeout(r, 100));
		await page.mouse.up();
		await page.mouse.down();
		await new Promise(r => setTimeout(r, 100));
		await page.mouse.up();

		const averageFPS = await getAverageFPS();
		TestResults.addResult({component: component, type: 'FPS', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

		expect(averageFPS).toBeGreaterThan(minFPS);
	});

	it('should have a good CLS', async () => {
		await page.evaluateOnNewDocument(CLS);
		await page.goto(`http://${serverAddr}/contextualPopupDecorator`);
		await new Promise(r => setTimeout(r, 200));
		await page.waitForSelector('#contextualPopupDecorator');
		await page.click('#contextualPopupDecorator');

		let actualCLS = await clsValue();

		TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

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
			const contextualPopupDecoratorPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await contextualPopupDecoratorPage.emulateCPUThrottling(CPUThrottling);

			await contextualPopupDecoratorPage.tracing.start({path: filename, screenshots: false});
			await contextualPopupDecoratorPage.goto(`http://${serverAddr}/contextualPopupDecorator`);
			await contextualPopupDecoratorPage.waitForSelector('#contextualPopupDecorator');
			await new Promise(r => setTimeout(r, 200));

			await contextualPopupDecoratorPage.tracing.stop();

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

			if (targetEnv === 'PC') await contextualPopupDecoratorPage.close();
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
