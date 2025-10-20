/* global CPUThrottling, page, minFPS, maxCLS, stepNumber, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {FPS, getAverageFPS} = require('../../TraceModel');
const {isValidJSON, newPageMultiple} = require('../../utils');

describe('OverallView', () => {
	const component = 'Overall';
	TestResults.newFile(component);

	it('FPS', async () => {
		await FPS();
		await page.goto(`http://${serverAddr}/#/overallView`);
		await page.waitForSelector('#tooltipButton');
		await page.click('#tooltipButton'); // to move to the next panel.
		await page.waitForSelector('#virtualGridListSecond');
		await page.keyboard.down('Escape'); // to move to the previous panel.
		await page.keyboard.up('Escape');
		await page.waitForSelector('#tooltipButton');

		await page.click('#tooltipButton'); // to move to the next panel.
		await page.waitForSelector('#virtualGridListSecond');
		await page.keyboard.down('Escape'); // to move to the previous panel.
		await page.keyboard.up('Escape');
		await page.waitForSelector('#tooltipButton');

		// focus various spottable components in the first panel and force the scroller to move
		await page.keyboard.down('ArrowUp');
		await page.keyboard.up('ArrowUp');
		await page.keyboard.down('ArrowUp');
		await page.keyboard.up('ArrowUp');
		await page.keyboard.down('ArrowUp');
		await page.keyboard.up('ArrowUp');
		await page.keyboard.down('ArrowUp');
		await page.keyboard.up('ArrowUp');

		// Change Slider value
		await page.keyboard.down('ArrowRight');
		await new Promise(r => setTimeout(r, 500));
		await page.keyboard.up('ArrowRight');

		// focus various spottable components in the first panel and force the scroller to move
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');
		await page.keyboard.down('ArrowLeft');
		await page.keyboard.up('ArrowLeft');
		await page.keyboard.down('ArrowRight');
		await page.keyboard.up('ArrowRight');
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');
		await page.keyboard.down('ArrowRight');
		await page.keyboard.up('ArrowRight');
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');

		const averageFPS = await getAverageFPS();
		TestResults.addResult({component: component, type: 'FPS', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

		expect(averageFPS).toBeGreaterThan(minFPS);
	});

	it('should have a good CLS, FCP, INP and LCP', async () => {
		let passContCLS = 0;
		let passContINP = 0;
		let passContFCP = 0;
		let passContLCP = 0;
		let avgCLS = 0;
		let avgINP = 0;
		let avgFCP = 0;
		let avgLCP = 0;
		for (let step = 0; step < stepNumber; step++) {
			const overallPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await overallPage.emulateCPUThrottling(CPUThrottling);
			await overallPage.goto(`http://${serverAddr}/#/overallView`);
			await overallPage.addScriptTag({url: webVitalsURL});
			await new Promise(r => setTimeout(r, 100));
			await overallPage.waitForSelector('#tooltipButton');
			await overallPage.click('#tooltipButton'); // to move to the next panel.
			await new Promise(r => setTimeout(r, 200));
			await overallPage.waitForSelector('#virtualGridListSecond');
			await new Promise(r => setTimeout(r, 200));
			await overallPage.keyboard.down('Escape'); // to move to the previous panel.
			await overallPage.keyboard.up('Escape');
			await new Promise(r => setTimeout(r, 200));

			overallPage.on("console", (msg) => {
				let jsonMsg = {};

				if (isValidJSON(msg.text())) {
					jsonMsg = JSON.parse(msg.text());
				}

				if (jsonMsg.name === 'CLS') {
					avgCLS = avgCLS + jsonMsg.value;
					if (jsonMsg.value < maxCLS) {
						passContCLS += 1;
					}
				} else if (jsonMsg.name === 'INP') {
					avgINP = avgINP + jsonMsg.value;
					if (jsonMsg.value < maxINP) {
						passContINP += 1;
					}
				} else if (jsonMsg.name === 'FCP') {
					avgFCP = avgFCP + jsonMsg.value;
					if (jsonMsg.value < maxFCP) {
						passContFCP += 1;
					}
				} else if (jsonMsg.name === 'LCP') {
					avgLCP = avgLCP + jsonMsg.value;
					if (jsonMsg.value < maxLCP) {
						passContLCP += 1;
					}
				}
			});

			await overallPage.evaluateHandle(() => {
				webVitals.onINP(function (inp) {
					console.log(JSON.stringify({"name": inp.name, "value": inp.value})); // eslint-disable-line no-console
				},
				{
					reportAllChanges: true
				}
				);

				webVitals.onCLS(function (cls) {
					console.log(JSON.stringify({"name": cls.name, "value": cls.value})); // eslint-disable-line no-console
				},
				{
					reportAllChanges: true
				}
				);

				webVitals.onFCP(function (fcp) {
					console.log(JSON.stringify({"name": fcp.name, "value": fcp.value})); // eslint-disable-line no-console
				},
				{
					reportAllChanges: true
				}
				);

				webVitals.onLCP(function (lcp) {
					console.log(JSON.stringify({"name": lcp.name, "value": lcp.value})); // eslint-disable-line no-console
				},
				{
					reportAllChanges: true
				}
				);
			});
			await new Promise(r => setTimeout(r, 1000));
			if (targetEnv === 'PC') await overallPage.close();
		}

		avgCLS = avgCLS / stepNumber;
		avgINP = avgINP / stepNumber;
		avgFCP = avgFCP / stepNumber;
		avgLCP = avgLCP / stepNumber;

		TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((avgCLS + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'INP', actualValue: Math.round((avgINP + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'FCP', actualValue: Math.round((avgFCP + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'LCP', actualValue: Math.round((avgLCP + Number.EPSILON) * 1000) / 1000});

		expect(avgCLS).toBeLessThan(maxCLS);
		expect(avgINP).toBeLessThan(maxINP);
		expect(avgFCP).toBeLessThan(maxFCP);
		expect(avgLCP).toBeLessThan(maxLCP);

		expect(passContCLS).toBeGreaterThan(passRatio * stepNumber);
		expect(passContINP).toBeGreaterThan(passRatio * stepNumber);
		expect(passContFCP).toBeGreaterThan(passRatio * stepNumber);
		expect(passContLCP).toBeGreaterThan(passRatio * stepNumber);
	});
});

