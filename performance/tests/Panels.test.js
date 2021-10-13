const TestResults = require('../TestResults');
const {DCL, FCP, FPS, LCP, FID, CLS} = require('../TraceModel');
const {getFileName} = require('../utils');

describe('Panels', () => {
	const component = 'Panels';
	const panel1 = '#panel-1';
	const panel1Button = '#panel-1-button';
	const panel2Button = '.enact_sandstone_Panels_Header_back';
	TestResults.newFile(component);

	it('FPS', async () => {
		const FPSValues = await FPS();
		await page.goto('http://localhost:8080/panels');
		await page.waitForSelector(panel1Button);
		await page.click(panel1Button);
		await page.waitForTimeout(500);
		await page.click(panel2Button);
		await page.waitForTimeout(500);
		await page.click(panel1Button);
		await page.waitForTimeout(500);
		await page.click(panel2Button);
		await page.waitForTimeout(500);
		await page.click(panel1Button);
		await page.waitForTimeout(500);
		await page.click(panel2Button);
		await page.waitForTimeout(500);
		await page.click(panel1Button);
		await page.waitForTimeout(500);
		await page.click(panel2Button);
		await page.waitForTimeout(500);
		await page.click(panel1Button);
		await page.waitForTimeout(500);
		await page.click(panel2Button);
		await page.waitForTimeout(500);

		const averageFPS = (FPSValues.reduce((a, b) => a + b, 0) / FPSValues.length) || 0;
		TestResults.addResult({component: component, type: 'Frames Per Second', actualValue: averageFPS});
	});

	it('should have a good FID and CLS', async () => {
		await page.evaluateOnNewDocument(FID);
		await page.evaluateOnNewDocument(CLS);
		await page.goto('http://localhost:8080/panels');
		await page.waitForSelector(panel1Button);
		await page.click(panel1Button);
		await page.waitForTimeout(500);
		await page.click(panel2Button);
		await page.waitForTimeout(500);
		await page.click(panel1Button);
		await page.waitForTimeout(500);
		await page.click(panel2Button);
		await page.waitForTimeout(500);
		await page.click(panel1Button);
		await page.waitForTimeout(500);
		await page.click(panel2Button);
		await page.waitForTimeout(500);

		let actualFirstInput = await page.evaluate(() => {
			return window.fid;
		});

		let actualCLS = await page.evaluate(() => {
			return window.cls;
		});

		TestResults.addResult({component: component, type: 'First Input Delay', actualValue: actualFirstInput});
		TestResults.addResult({component: component, type: 'CLS', actualValue: actualCLS});

		expect(actualFirstInput).toBeLessThan(maxFID);
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
			await page.goto('http://localhost:8080/panels');
			await page.waitForSelector(panel1);
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
