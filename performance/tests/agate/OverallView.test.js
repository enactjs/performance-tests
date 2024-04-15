/* global CPUThrottling, page, minFPS, maxFID, maxCLS, stepNumber, maxDCL, maxFCP, maxLCP, passRatio, serverAddr, targetEnv */

const TestResults = require('../../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, firstInputValue, getFileName, newPageMultiple} = require('../../utils');

describe('OverallView', () => {
	const component = 'Overall';
	TestResults.newFile(component);

	it('FPS', async () => {
		await FPS();
		await page.goto(`http://${serverAddr}/overallView`);
		await page.waitForSelector('#tooltipButton');
		await page.click('[aria-label="Next Tab"]'); // to move to the next panel.
		await page.waitForSelector('#virtualGridListSecond');
		await new Promise(r => setTimeout(r, 200));
		await page.click(('[aria-label="Previous Tab"]')); // to move to the previous tab.
		await page.waitForSelector('#tooltipButton');
		await new Promise(r => setTimeout(r, 200));

		await page.click('#tooltipButton'); // to move to the next panel.
		await page.waitForSelector('#virtualGridListSecond');
		await new Promise(r => setTimeout(r, 200));
		await page.click(('[aria-label="Previous Tab"]')); // to move to the previous tab.
		await page.waitForSelector('#tooltipButton');
		await new Promise(r => setTimeout(r, 100));

		// focus various spottable components in the first tab and force the scroller to move
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('ArrowRight');
		await page.keyboard.up('ArrowRight');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('ArrowRight');
		await page.keyboard.up('ArrowRight');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('ArrowRight');
		await page.keyboard.up('ArrowRight');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('ArrowRight');
		await page.keyboard.up('ArrowRight');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('ArrowUp');
		await page.keyboard.up('ArrowUp');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('ArrowUp');
		await page.keyboard.up('ArrowUp');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('ArrowUp');
		await page.keyboard.up('ArrowUp');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('ArrowUp');
		await page.keyboard.up('ArrowUp');

		const averageFPS = await getAverageFPS();
		TestResults.addResult({component: component, type: 'FPS', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

		expect(averageFPS).toBeGreaterThan(minFPS);
	});

	it('should have a good FID and CLS', async () => {
		await page.evaluateOnNewDocument(FID);
		await page.evaluateOnNewDocument(CLS);
		await page.goto(`http://${serverAddr}/overallView`);
		await page.waitForSelector('#tooltipButton');
		await page.click('[aria-label="Next Tab"]'); // to move to the next tab.
		await page.waitForSelector('#virtualGridListSecond');
		await new Promise(r => setTimeout(r, 200));
		await page.click(('[aria-label="Previous Tab"]')); // to move to the previous tab.
		await page.waitForSelector('#tooltipButton');
		await new Promise(r => setTimeout(r, 200));

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
			const overallViewPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await overallViewPage.emulateCPUThrottling(CPUThrottling);

			await overallViewPage.tracing.start({path: filename, screenshots: false});
			await overallViewPage.goto(`http://${serverAddr}/overallView`);
			await overallViewPage.waitForSelector('#virtualGridList');
			await new Promise(r => setTimeout(r, 200));

			await overallViewPage.tracing.stop();

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

			if (targetEnv === 'PC') await overallViewPage.close();
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

