/* global CPUThrottling, page, minFPS, maxFID, maxCLS, stepNumber, maxDCL, maxFCP, maxLCP, passRatio, serverAddr, targetEnv */

const TestResults = require('../../TestResults');
const {FPS, getAverageFPS, PageLoadingMetrics, FID, CLS} = require('../../TraceModel');
const {clsValue, firstInputValue, getFileName, newPageMultiple} = require('../../utils');

describe('PopupMenu', () => {
	const component = 'PopupMenu';
	const open = '#button-open';
	const closeButton = '#button-close';
	TestResults.newFile(component);

	it('FPS', async () => {
		await FPS();
		await page.goto(`http://${serverAddr}/popupMenu`);
		await page.waitForSelector('#popupMenu');
		await page.click(closeButton);
		await new Promise(r => setTimeout(r, 500));
		await page.click(open);
		await new Promise(r => setTimeout(r, 500));
		await page.click(closeButton);
		await new Promise(r => setTimeout(r, 500));
		await page.click(open);
		await new Promise(r => setTimeout(r, 500));
		await page.click(closeButton);
		await new Promise(r => setTimeout(r, 500));
		await page.click(open);
		await new Promise(r => setTimeout(r, 500));
		await page.click(closeButton);
		await new Promise(r => setTimeout(r, 500));

		const averageFPS = await getAverageFPS();
		TestResults.addResult({component: component, type: 'FPS', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

		expect(averageFPS).toBeGreaterThan(minFPS);
	});

	it('should have a good FID and CLS', async () => {
		await page.evaluateOnNewDocument(FID);
		await page.evaluateOnNewDocument(CLS);
		await page.goto(`http://${serverAddr}/popupMenu`);
		await page.waitForSelector('#popupMenu');
		await page.click(closeButton);
		await new Promise(r => setTimeout(r, 500));
		await page.click(open);
		await new Promise(r => setTimeout(r, 500));
		await page.click(closeButton);
		await new Promise(r => setTimeout(r, 500));
		await page.click(open);
		await new Promise(r => setTimeout(r, 500));
		await page.click(closeButton);
		await new Promise(r => setTimeout(r, 500));
		await page.click(open);
		await new Promise(r => setTimeout(r, 500));
		await page.click(closeButton);
		await new Promise(r => setTimeout(r, 500));

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
			const popupMenuPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await popupMenuPage.emulateCPUThrottling(CPUThrottling);

			await popupMenuPage.tracing.start({path: filename, screenshots: false});
			await popupMenuPage.goto(`http://${serverAddr}/popupMenu`);
			await popupMenuPage.waitForSelector('#popupMenu');
			await new Promise(r => setTimeout(r, 200));

			await popupMenuPage.tracing.stop();

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

			if (targetEnv === 'PC') await popupMenuPage.close();
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

