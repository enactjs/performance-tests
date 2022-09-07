/* global page, pageTV, minFPS, maxFID, maxCLS, stepNumber, testMultiple, maxDCL, maxFCP, maxLCP, passRatio, serverAddr, targetEnv */

const TestResults = require('../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../TraceModel');
const {clsValue, firstInputValue, getFileName} = require('../utils');

describe('OverallView', () => {
	const component = 'Overall';
	TestResults.newFile(component);

	it('FPS', async () => {
		const overallPage = targetEnv === 'TV' ? pageTV : page;
		await FPS();
		await overallPage.goto(`http://${serverAddr}/overallView`);
		await overallPage.waitForSelector('#tooltipButton');
		await overallPage.click('#tooltipButton'); // to move to the next panel.
		await overallPage.waitForSelector('#virtualGridListSecond');
		await overallPage.keyboard.down('Escape'); // to move to the previous panel.
		await overallPage.keyboard.up('Escape');
		await overallPage.waitForSelector('#tooltipButton');

		await overallPage.click('#tooltipButton'); // to move to the next panel.
		await overallPage.waitForSelector('#virtualGridListSecond');
		await overallPage.keyboard.down('Escape'); // to move to the previous panel.
		await overallPage.keyboard.up('Escape');
		await overallPage.waitForSelector('#tooltipButton');

		// focus various spottable components in the first panel and force the scroller to move
		await overallPage.keyboard.down('ArrowUp');
		await overallPage.keyboard.up('ArrowUp');
		await overallPage.keyboard.down('ArrowUp');
		await overallPage.keyboard.up('ArrowUp');
		await overallPage.keyboard.down('ArrowUp');
		await overallPage.keyboard.up('ArrowUp');
		await overallPage.keyboard.down('ArrowUp');
		await overallPage.keyboard.up('ArrowUp');

		// Change Slider value
		await overallPage.keyboard.down('ArrowRight');
		await overallPage.waitForTimeout(500);
		await overallPage.keyboard.up('ArrowRight');

		// focus various spottable components in the first panel and force the scroller to move
		await overallPage.keyboard.down('ArrowDown');
		await overallPage.keyboard.up('ArrowDown');
		await overallPage.keyboard.down('ArrowLeft');
		await overallPage.keyboard.up('ArrowLeft');
		await overallPage.keyboard.down('ArrowRight');
		await overallPage.keyboard.up('ArrowRight');
		await overallPage.keyboard.down('ArrowDown');
		await overallPage.keyboard.up('ArrowDown');
		await overallPage.keyboard.down('ArrowDown');
		await overallPage.keyboard.up('ArrowDown');
		await overallPage.keyboard.down('ArrowDown');
		await overallPage.keyboard.up('ArrowDown');
		await overallPage.keyboard.down('ArrowDown');
		await overallPage.keyboard.up('ArrowDown');
		await overallPage.keyboard.down('ArrowRight');
		await overallPage.keyboard.up('ArrowRight');
		await overallPage.keyboard.down('ArrowDown');
		await overallPage.keyboard.up('ArrowDown');

		const averageFPS = await getAverageFPS();
		TestResults.addResult({component: component, type: 'FPS', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

		expect(averageFPS).toBeGreaterThan(minFPS);
	});

	it('should have a good FID and CLS', async () => {
		const overallPage = targetEnv === 'TV' ? pageTV : page;
		await overallPage.evaluateOnNewDocument(FID);
		await overallPage.evaluateOnNewDocument(CLS);
		await overallPage.goto(`http://${serverAddr}/overallView`);
		await overallPage.waitForSelector('#tooltipButton');
		await overallPage.click('#tooltipButton'); // to move to the next panel.
		await overallPage.waitForSelector('#virtualGridListSecond');
		await overallPage.keyboard.down('Escape'); // to move to the previous panel.
		await overallPage.keyboard.up('Escape');
		await overallPage.waitForSelector('#tooltipButton');

		let actualFirstInput = await firstInputValue();
		let actualCLS = await clsValue();

		TestResults.addResult({component: component, type: 'FID', actualValue: Math.round((actualFirstInput + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

		expect(actualFirstInput).toBeLessThan(maxFID);
		expect(actualCLS).toBeLessThan(maxCLS);
	});

	it('should have a good DCL, FCP and LCP', async () => {
		const overallPage = targetEnv === 'TV' ? pageTV : page;
		const filename = getFileName(component);

		let passContDCL = 0;
		let passContFCP = 0;
		let passContLCP = 0;
		let avgDCL = 0;
		let avgFCP = 0;
		let avgLCP = 0;
		for (let step = 0; step < stepNumber; step++) {
			const overallViewMultiplePage = targetEnv === 'TV' ? overallPage : await testMultiple.newPage();

			await overallViewMultiplePage.tracing.start({path: filename, screenshots: false});
			await overallViewMultiplePage.goto(`http://${serverAddr}/overallView`);
			await overallViewMultiplePage.waitForSelector('#virtualGridList');
			await overallViewMultiplePage.waitForTimeout(200);

			await overallViewMultiplePage.tracing.stop();

			const {actualDCL, actualFCP, actualLCP} = PageLoadingMetrics(filename);
			console.log(actualDCL, actualFCP, actualLCP)
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

			if (targetEnv === 'PC') await overallViewMultiplePage.close();
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

