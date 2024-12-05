/* global CPUThrottling, page, minFPS, stepNumber, maxDCL, maxFCP, maxINP, maxLCP, maxCLS, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {CLS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, getFileName, newPageMultiple} = require("../../utils");

describe('ColorPicker', () => {
	const component = 'ColorPicker';
	TestResults.newFile(component);

	it('should have good CLS', async () => {
		await page.evaluateOnNewDocument(CLS);
		await page.goto(`http://${serverAddr}/colorPicker`);
		await page.waitForSelector('#colorPicker');
		await page.keyboard.down('ArrowRight');
		await page.keyboard.down('Enter');

		let actualCLS = await clsValue();

		TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

		expect(actualCLS).toBeLessThan(maxCLS);
	});

	it('should have a good INP', async () => {
		await page.goto(`http://${serverAddr}/colorPicker`);
		await page.addScriptTag({url: webVitalsURL});
		await page.waitForSelector('#colorPicker');
		// await new Promise(r => setTimeout(r, 200));
		await page.keyboard.down('ArrowRight');
		await page.keyboard.up('ArrowRight');
		await page.keyboard.down('Enter');
		await page.keyboard.up('Enter');
		// await new Promise(r => setTimeout(r, 200));
		// await page.keyboard.down('Enter');
		// await page.keyboard.up('Enter');
		// // await new Promise(r => setTimeout(r, 200));
		// await page.keyboard.down('ArrowRight');
		// await page.keyboard.up('ArrowRight');
		// // await new Promise(r => setTimeout(r, 200));
		// await page.keyboard.down('Enter');
		// await page.keyboard.up('Enter');
		// // await new Promise(r => setTimeout(r, 200));
		// await page.keyboard.down('ArrowLeft');
		// await page.keyboard.up('ArrowLeft');
		// // await new Promise(r => setTimeout(r, 200));
		// await page.keyboard.down('ArrowLeft');
		// await page.keyboard.up('ArrowLeft');
		// // await new Promise(r => setTimeout(r, 200));
		// await page.keyboard.down('Enter');
		// await page.keyboard.up('Enter');
		// // await new Promise(r => setTimeout(r, 200));

		let inpValue;

		page.on("console", (msg) => {
			inpValue = Number(msg.text());
			TestResults.addResult({component: component, type: 'INP', actualValue: Math.round((inpValue + Number.EPSILON) * 1000) / 1000});
			expect(inpValue).toBeLessThan(maxINP);
		});

		await page.evaluateHandle(() => {
			webVitals.onINP(function (inp) {
					console.log(inp.value); // eslint-disable-line no-console
				},
				{
					reportAllChanges: true
				}
			);
		});
		await new Promise(r => setTimeout(r, 1000));
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
			const tabLayoutPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await tabLayoutPage.emulateCPUThrottling(CPUThrottling);

			await tabLayoutPage.tracing.start({path: filename, screenshots: false});
			await tabLayoutPage.goto(`http://${serverAddr}/colorPicker`);
			await tabLayoutPage.waitForSelector('#colorPicker');
			await new Promise(r => setTimeout(r, 200));

			await tabLayoutPage.tracing.stop();

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

			if (targetEnv === 'PC') await tabLayoutPage.close();
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
