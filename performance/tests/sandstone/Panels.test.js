/* global CPUThrottling, page, minFPS, maxFID, maxCLS, stepNumber, maxDCL, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals */

const TestResults = require('../../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, firstInputValue, getFileName, newPageMultiple} = require('../../utils');

describe('Panels', () => {
	const component = 'Panels';
	const panel1 = '#panel-1';
	const nextPanelButton = '#goToNextPanel';
	const previousPanelButton = '[aria-label="go to previous"]';
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
			await panelsPage.goto(`http://${serverAddr}/panels`);
			await panelsPage.waitForSelector(panel1);
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

	describe('Panels Transition', () => {
		it('FPS', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/panels`);
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

		it('should have a good FID and CLS', async () => {
			await page.evaluateOnNewDocument(FID);
			await page.evaluateOnNewDocument(CLS);
			await page.goto(`http://${serverAddr}/panels`);
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

			let actualFirstInput = await firstInputValue();
			let actualCLS = await clsValue();

			TestResults.addResult({component: component, type: 'FID', actualValue: Math.round((actualFirstInput + Number.EPSILON) * 1000) / 1000});
			TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

			expect(actualFirstInput).toBeLessThan(maxFID);
			expect(actualCLS).toBeLessThan(maxCLS);
		});

		it('should have a good INP', async () => {
			await page.goto(`http://${serverAddr}/panels`);
			await page.addScriptTag({url: 'https://unpkg.com/web-vitals@4/dist/web-vitals.iife.js'});
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
	});

	describe('Navigation inside Panel', () => {
		it('FPS', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/panels`);
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

		it('should have a good FID and CLS', async () => {
			await page.evaluateOnNewDocument(FID);
			await page.evaluateOnNewDocument(CLS);
			await page.goto(`http://${serverAddr}/panels`);
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

			let actualFirstInput = await firstInputValue();
			let actualCLS = await clsValue();

			TestResults.addResult({component: component, type: 'FID on panel content focus', actualValue: Math.round((actualFirstInput + Number.EPSILON) * 1000) / 1000});
			TestResults.addResult({component: component, type: 'CLS on panel content focus', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

			expect(actualFirstInput).toBeLessThan(maxFID);
			expect(actualCLS).toBeLessThan(maxCLS);
		});

		it('should have a good INP', async () => {
			await page.goto(`http://${serverAddr}/panels`);
			await page.addScriptTag({url: 'https://unpkg.com/web-vitals@4/dist/web-vitals.iife.js'});
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
		});
	});
});
