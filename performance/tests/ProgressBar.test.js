const TestResults = require('../TestResults');
const {CLS, DCL, FCP, LCP} = require('../TraceModel');
const {getFileName} = require('../utils');

describe('ProgressBar', () => {
	const component = 'ProgressBar';
	TestResults.newFile(component);

	it('should have a good CLS', async () => {
		await page.evaluateOnNewDocument(CLS);
		await page.goto('http://localhost:8080/progressBar');
		await page.waitForSelector('#progressBar');
		await page.focus('#progressBar');
		await page.keyboard.down('Enter');
		await page.waitForTimeout(200);

		let actualCLS = await page.evaluate(() => {
			return window.cls;
		});

		TestResults.addResult({component: component, type: 'CLS', actualValue: actualCLS});
		expect(actualCLS).toBeLessThan(maxCLS);
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
			await page.goto('http://localhost:8080/progressBar');
			await page.waitForSelector('#progressBar');
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
		TestResults.addResult({component: component, type: 'average FCP', actualValue: avgFCP});
		TestResults.addResult({component: component, type: 'average LCP', actualValue: avgLCP});

		expect(contDCL).toBeGreaterThan(percent);
		expect(avgDCL).toBeLessThan(maxDCL);

		expect(contFCP).toBeGreaterThan(percent);
		expect(avgFCP).toBeLessThan(maxFCP);

		expect(contLCP).toBeGreaterThan(percent);
		expect(avgLCP).toBeLessThan(maxLCP);
	});
});