const TestResults = require('../TestResults');
const {CLS, DCL, FCP, FID, FPS, LCP} = require('../TraceModel');
const {getFileName} = require('../utils');

describe('WizardPanels', () => {
	const component = 'WizardPanels';
	TestResults.newFile(component);

	describe('click', () => {
		it('animates', async () => {
			const FPSValues = await FPS();
			await page.goto('http://localhost:8080/wizardPanels');
			await page.waitForTimeout(200);
			await page.click('#nextButton'); // to animate the WizardPanel.
			await page.waitForTimeout(200);

			const averageFPS = (FPSValues.reduce((a, b) => a + b, 0) / FPSValues.length) || 0;
			TestResults.addResult({component: component, type: 'Frames Per Second Click', actualValue: averageFPS});
		});
	});

	describe('keypress', () => {
		it('animates', async () => {
			const FPSValues = await FPS();
			await page.goto('http://localhost:8080/wizardPanels');
			await page.waitForSelector('#wizardPanels');
			await page.focus('#nextButton');
			await page.waitForTimeout(200);
			await page.keyboard.down('Enter');
			await page.waitForTimeout(200);

			const averageFPS = (FPSValues.reduce((a, b) => a + b, 0) / FPSValues.length) || 0;
			TestResults.addResult({component: component, type: 'Frames Per Second Click', actualValue: averageFPS});
		});
	});

	it('should have a good FID and CLS', async () => {
		await page.evaluateOnNewDocument(FID);
		await page.evaluateOnNewDocument(CLS);
		await page.goto('http://localhost:8080/wizardPanels');
		await page.waitForSelector('#wizardPanels');
		await page.focus('#wizardPanels');
		await page.keyboard.down('Enter');

		let actualFirstInput = await page.evaluate(() => {
			return window.fid;
		});

		let actualCLS = await page.evaluate(() => {
			return window.cls;
		});

		TestResults.addResult({component: component, type: 'First Input Delay', actualValue: actualFirstInput});
		expect(actualFirstInput).toBeLessThan(maxFID);

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
			await page.goto('http://localhost:8080/wizardPanels');
			await page.waitForSelector('#wizardPanels');
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

