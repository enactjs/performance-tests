/* global CPUThrottling, page, minFPS, maxFID, maxCLS, stepNumber, maxDCL, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, firstInputValue, getFileName, newPageMultiple} = require('../../utils');

describe('Button', () => {
	const component = 'Button';
	TestResults.newFile(component);

	describe('click', () => {
		it('animates', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/button`);
			await page.waitForSelector('#button');
			await page.click('#button'); // to move mouse on the button.
			await page.mouse.down();
			await new Promise(r => setTimeout(r, 100));
			await page.mouse.up();
			await page.mouse.down();
			await new Promise(r => setTimeout(r, 100));
			await page.mouse.up();
			await page.mouse.down();
			await new Promise(r => setTimeout(r, 100));
			await page.mouse.up();
			await page.mouse.down();
			await new Promise(r => setTimeout(r, 100));
			await page.mouse.up();

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Click', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	describe('keypress', () => {
		it('animates', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/button`);
			await page.waitForSelector('#button');
			await page.focus('#button');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.up('Enter');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.up('Enter');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.up('Enter');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.up('Enter');

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Keypress', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	it('should have a good FID and CLS', async () => {
		await page.evaluateOnNewDocument(FID);
		await page.evaluateOnNewDocument(CLS);
		await page.goto(`http://${serverAddr}/button`);
		await page.waitForSelector('#button');
		await page.focus('#button');
		await page.keyboard.down('Enter');
		await new Promise(r => setTimeout(r, 200));

		let actualFirstInput = await firstInputValue();
		let actualCLS = await clsValue();

		TestResults.addResult({component: component, type: 'FID', actualValue: Math.round((actualFirstInput + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

		expect(actualFirstInput).toBeLessThan(maxFID);
		expect(actualCLS).toBeLessThan(maxCLS);
	});

	it('should have a good INP', async () => {
		await page.goto(`http://${serverAddr}/button`);
		await page.addScriptTag({url: webVitalsURL});
		await new Promise(r => setTimeout(r, 200));
		await page.waitForSelector('#button');
		await new Promise(r => setTimeout(r, 200));
		await page.focus('#button');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.down('Enter');
		await page.keyboard.up('Enter');
		await new Promise(r => setTimeout(r, 200));

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

	it('should have a good DCL, FCP and LCP', async () => {
		const filename = getFileName(component);

		let passContDCL = 0;
		let passContFCP = 0;
		let passContLCP = 0;
		let avgDCL = 0;
		let avgFCP = 0;
		let avgLCP = 0;
		for (let step = 0; step < stepNumber; step++) {
			const buttonPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await buttonPage.emulateCPUThrottling(CPUThrottling);

			await buttonPage.tracing.start({path: filename, screenshots: false});
			await buttonPage.goto(`http://${serverAddr}/button`);
			await buttonPage.waitForSelector('#button');
			await new Promise(r => setTimeout(r, 200));

			await buttonPage.tracing.stop();

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

			if (targetEnv === 'PC') await buttonPage.close();
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

