/* global CPUThrottling, page, minFPS, maxCLS, stepNumber, maxDCL, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {getFileName, newPageMultiple} = require('../../utils');

describe('QuickGuidePanels', () => {
	const component = 'QuickGuidePanels';
	const panel = '#panel-1';
	const nextQuickPanelButton = '[aria-label="Next"]';
	const previousQuickPanelButton = '[aria-label="Previous"]';
	TestResults.newFile(component);

	it('should have a good DCL, FCP and LCP', async () => {
		const filename = getFileName(component);

		let passContDCL = 0;
		let passContFCP = 0;
		let passContLCP = 0;
		let avgDCL = 0;
		let avgFCP = 0;
		let avgLCP = 0;
		for (let step = 0; step < stepNumber; step++) {
			const panelsPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await panelsPage.emulateCPUThrottling(CPUThrottling);

			await panelsPage.tracing.start({path: filename, screenshots: false});
			await panelsPage.goto(`http://${serverAddr}/quickGuidePanels`);
			await panelsPage.waitForSelector(panel);
			await new Promise(r => setTimeout(r, 200));

			await panelsPage.tracing.stop();

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

			if (targetEnv === 'PC') await panelsPage.close();
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

	describe('Quick Guide Panels Transition', () => {
		it('FPS', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/quickGuidePanels`);
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

		it('should have a good CLS and INP', async () => {
			await page.goto(`http://${serverAddr}/quickGuidePanels`);
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

			let inpValue, clsValue;

			page.on("console", (msg) => {
				let jsonMsg = JSON.parse(msg.text());
				if(jsonMsg.name === 'CLS') {
					clsValue = Number(jsonMsg.value);
					TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((clsValue + Number.EPSILON) * 1000) / 1000});
					expect(clsValue).toBeLessThan(maxCLS);
				} else if (jsonMsg.name === 'INP') {
					inpValue = Number(jsonMsg.value);
					TestResults.addResult({component: component, type: 'INP', actualValue: Math.round((inpValue + Number.EPSILON) * 1000) / 1000});
					expect(inpValue).toBeLessThan(maxINP);
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
			});
			await new Promise(r => setTimeout(r, 1000));
		});
	});

	describe('Navigation inside Quick Guide Panels', () => {
		it('FPS', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/quickGuidePanels`);
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

		it('should have a good CLS and INP', async () => {
			await page.goto(`http://${serverAddr}/quickGuidePanels`);
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

			let inpValue, clsValue;

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
	});
});
