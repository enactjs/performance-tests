/* global page, minFPS, maxCLS, stepNumber, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {CLS, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, getFileName, newPageMultiple} = require('../../utils');

describe('Panels', () => {
	const component = 'Panels';
	const panel1 = '#panel-1';
	const nextPanelButton = '#goToNextPanel';
	const previousPanelButton = '[aria-label="go to previous"]';
	TestResults.newFile(component);

	describe('Panels Transition', () => {
		it('FPS', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/#/panels`);
			await page.waitForSelector(nextPanelButton);
			await page.click(nextPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(previousPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(nextPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(previousPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(nextPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(previousPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(nextPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(previousPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(nextPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(previousPanelButton);
			await new Promise(r => setTimeout(r, 500));

			const averageFPS = await getAverageFPS();
			TestResults.addResult({
				component: component,
				type: 'FPS',
				actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000
			});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});

		it('should have a good CLS, FCP, INP and LCP', async () => {
			await page.goto(`http://${serverAddr}/#/panels`);
			await page.addScriptTag({url: webVitalsURL});
			await page.waitForSelector(nextPanelButton);
			await page.click(nextPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(previousPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(nextPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(previousPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(nextPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(previousPanelButton);
			await new Promise(r => setTimeout(r, 500));

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

	describe('Navigation inside Panel', () => {
		it('FPS', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/#/panels`);
			await page.waitForSelector(nextPanelButton);
			await page.click(nextPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.keyboard.down('ArrowDown');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowRight');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowRight');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowLeft');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowLeft');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowDown');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowRight');

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS on panel content focus', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});

		it('should have a good CLS, FCP, INP and LCP', async () => {
			await page.goto(`http://${serverAddr}/#/panels`);
			await page.addScriptTag({url: webVitalsURL});
			await page.waitForSelector(nextPanelButton);
			await page.click(nextPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.keyboard.down('ArrowDown');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowRight');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowRight');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowLeft');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowLeft');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowDown');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowRight');
			await new Promise(r => setTimeout(r, 1000));

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
});
