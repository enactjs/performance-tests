const TestResults = require('../TestResults');
const {CLS, DCL, FCP, FID, LCP} = require('../TraceModel');
const {getFileName} = require('../utils');

describe('BodyText', () => {
	const component = 'BodyText';
	TestResults.newFile(component);

	it('should have a good FCP', async () => {
		const filename = getFileName(component);

		let cont = 0;
		let avg = 0;
		for (let step = 0; step < stepNumber; step++) {
			const page = await testMultiple.newPage();

			await page.tracing.start({path: filename, screenshots: false});
			await page.goto('http://localhost:8080/bodyText');
			await page.waitForSelector('#bodyText');

			await page.tracing.stop();

			const actualFCP = await FCP(filename);
			avg = avg + actualFCP;

			if (actualFCP < maxFCP) {
				cont += 1;
			}
			await page.close();
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
			await DCLPage.goto('http://localhost:8080/bodyText');
			await DCLPage.waitForSelector('#bodyText');

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
});
