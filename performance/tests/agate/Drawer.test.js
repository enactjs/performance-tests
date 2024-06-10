/* global CPUThrottling, page, minFPS, maxFID, maxCLS, stepNumber, maxDCL, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv */

const TestResults = require('../../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics, coreWebVitals} = require('../../TraceModel');
const {clsValue, firstInputValue, getFileName, newPageMultiple} = require('../../utils');

describe('Drawer', () => {
	const component = 'Drawer';
	const open = '#button-open';
	const closeButton = '#button-close';
	TestResults.newFile(component);

	describe('click', () => {
		it('animates', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/drawer`);
			await page.waitForSelector('#agate-drawer');
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
			TestResults.addResult({component: component, type: 'FPS Click', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	describe('keypress', () => {
		it('animates', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/drawer`);
			await page.waitForSelector('#agate-drawer');
			await page.focus('#button-close');
			await page.keyboard.down('Enter');
			await page.keyboard.up('Enter');
			await new Promise(r => setTimeout(r, 500));
			await page.keyboard.down('Enter');
			await page.keyboard.up('Enter');
			await new Promise(r => setTimeout(r, 500));
			await page.keyboard.down('Enter');
			await page.keyboard.up('Enter');
			await new Promise(r => setTimeout(r, 500));
			await page.keyboard.down('Enter');
			await page.keyboard.up('Enter');
			await new Promise(r => setTimeout(r, 500));
			await page.keyboard.down('Enter');
			await page.keyboard.up('Enter');

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Keypress', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	it('should have a good FID and CLS', async () => {
		await page.evaluateOnNewDocument(FID);
		await page.evaluateOnNewDocument(CLS);
		await page.goto(`http://${serverAddr}/drawer`);
		await page.waitForSelector('#agate-drawer');
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

	it('should have a good INP', async () => {
		await page.goto(`http://${serverAddr}/drawer`);
		await coreWebVitals.attachCwvLib(page);
		await page.waitForSelector('#agate-drawer');
		await page.click(closeButton);
		await new Promise(r => setTimeout(r, 500));
		await page.click(open);
		await new Promise(r => setTimeout(r, 500));
		await page.click(closeButton);
		await new Promise(r => setTimeout(r, 500));

		let inpValue;

		page.on("console", (msg) => {
			inpValue = Number(msg.text());
			TestResults.addResult({component: component, type: 'INP', actualValue: Math.round((inpValue + Number.EPSILON) * 1000) / 1000});
			expect(inpValue).toBeLessThan(maxINP);
		});

		await page.evaluateHandle(() => {
			window.webVitals.getINP(function (inp) {
				console.log(inp.value); // eslint-disable-line no-console
			},
			{
				reportAllChanges: true
			}
			);
		});
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
			const DrawerPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await DrawerPage.emulateCPUThrottling(CPUThrottling);

			await DrawerPage.tracing.start({path: filename, screenshots: false});
			await DrawerPage.goto(`http://${serverAddr}/drawer`);
			await DrawerPage.waitForSelector('#agate-drawer');
			await new Promise(r => setTimeout(r, 200));

			await DrawerPage.tracing.stop();

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

			if (targetEnv === 'PC') await DrawerPage.close();
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
