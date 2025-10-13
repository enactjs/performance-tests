/* global page, minFPS, maxCLS, stepNumber, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {CLS, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, getFileName, newPageMultiple} = require('../../utils');

describe('QuickGuidePanels', () => {
	const component = 'QuickGuidePanels';
	const panel = '#panel-1';
	const nextQuickPanelButton = '[aria-label="Next"]';
	const previousQuickPanelButton = '[aria-label="Previous"]';
	TestResults.newFile(component);

	describe('Quick Guide Panels Transition', () => {
		it('FPS', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/#/quickGuidePanels`);
			await page.waitForSelector(nextQuickPanelButton);
			await page.click(nextQuickPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(nextQuickPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(previousQuickPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(previousQuickPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(nextQuickPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(nextQuickPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(previousQuickPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(previousQuickPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(nextQuickPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(nextQuickPanelButton);
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
			await page.goto(`http://${serverAddr}/#/quickGuidePanels`);
			await page.addScriptTag({url: webVitalsURL});
			await page.waitForSelector(nextQuickPanelButton);
			await page.click(nextQuickPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(previousQuickPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(nextQuickPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(previousQuickPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(nextQuickPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.click(previousQuickPanelButton);
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

	describe('Navigation inside Quick Guide Panels', () => {
		it('FPS', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/#/quickGuidePanels`);
			await page.waitForSelector(nextQuickPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.keyboard.down('ArrowRight');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowLeft');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowRight');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowLeft');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowRight');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('Enter');

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS on panel content focus', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThanOrEqual(minFPS);
		});

		it('should have a good CLS, FCP, INP and LCP', async () => {
			await page.goto(`http://${serverAddr}/#/quickGuidePanels`);
			await page.addScriptTag({url: webVitalsURL});
			await page.waitForSelector(nextQuickPanelButton);
			await new Promise(r => setTimeout(r, 500));
			await page.keyboard.down('ArrowRight');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowLeft');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowRight');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowLeft');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowRight');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));

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
