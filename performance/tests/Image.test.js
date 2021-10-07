const TestResults = require('../TestResults');
const {DCL, FCP, LCP} = require('../TraceModel');
const {getFileName} = require('../utils');

describe('Image', () => {
	const component = 'Image';
	TestResults.newFile(component);

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
			await page.goto('http://localhost:8080/image');
			await page.waitForSelector('#image');
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
});
