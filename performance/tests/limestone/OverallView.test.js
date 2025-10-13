/* global page, minFPS, maxCLS, stepNumber, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {CLS, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, getFileName, newPageMultiple} = require('../../utils');

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
		await page.goto(`http://${serverAddr}/#/overallView`);
		await page.addScriptTag({url: webVitalsURL});
		await page.waitForSelector('#tooltipButton');
		await page.click('#tooltipButton'); // to move to the next panel.
		await new Promise(r => setTimeout(r, 200));
		await page.waitForSelector('#virtualGridListSecond');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.down('Escape'); // to move to the previous panel.
		await page.keyboard.up('Escape');
		await new Promise(r => setTimeout(r, 200));

		page.on("console", (msg) => {
			let jsonMsg = JSON.parse(msg.text());
			TestResults.addResult({component: component, type: jsonMsg.name, actualValue: Math.round((Number(jsonMsg.value) + Number.EPSILON) * 1000) / 1000});

			if (jsonMsg.name === 'CLS') {
				expect(Number(jsonMsg.value)).toBeLessThan(maxCLS);
			} else if (jsonMsg.name === 'INP') {
				expect(Number(jsonMsg.value)).toBeLessThan(maxINP);
			} else if (jsonMsg.name === 'FCP') {
				expect(Number(jsonMsg.value)).toBeLessThan(maxFCP);
			} else if (jsonMsg.name === 'LCP') {
				expect(Number(jsonMsg.value)).toBeLessThan(maxLCP);
			}
		});

		await page.evaluateHandle(() => {
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
	});
});

