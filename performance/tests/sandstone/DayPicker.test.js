/* global CPUThrottling, page, minFPS, maxCLS, stepNumber, maxDCL, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {CLS, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, getFileName, newPageMultiple} = require('../../utils');

describe('DayPicker', () => {
	const component = 'DayPicker';
	TestResults.newFile(component);

	describe('click', () => {
		it('animates', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/#/dayPicker`);
			await new Promise(r => setTimeout(r, 500));
			await page.click('#dayPicker'); // to move mouse on the dayPicker.
			await page.mouse.down();
			await new Promise(r => setTimeout(r, 200));
			await page.mouse.up();
			await page.mouse.down();
			await new Promise(r => setTimeout(r, 200));
			await page.mouse.up();
			await page.mouse.down();
			await new Promise(r => setTimeout(r, 200));
			await page.mouse.up();
			await page.mouse.down();
			await new Promise(r => setTimeout(r, 200));
			await page.mouse.up();

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Click', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	describe('keypress', () => {
		it('animates', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/#/dayPicker`);
			await page.waitForSelector('#dayPicker');
			await page.focus('#dayPicker');
			await page.keyboard.down('ArrowDown');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.up('Enter');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.up('Enter');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.up('Enter');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.up('Enter');

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Keypress', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	it('should have a good CLS', async () => {
		await page.evaluateOnNewDocument(CLS);
		await page.goto(`http://${serverAddr}/#/dayPicker`);
		await page.waitForSelector('#dayPicker');
		await page.keyboard.down('ArrowDown');
		await page.keyboard.down('Enter');

		let actualCLS = await clsValue();

		TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

		expect(actualCLS).toBeLessThan(maxCLS);
	});

	it('should have a good INP', async () => {
		await page.goto(`http://${serverAddr}/#/dayPicker`);
		await page.addScriptTag({url: webVitalsURL});
		await page.waitForSelector('#dayPicker');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.down('Enter');
		await page.keyboard.up('Enter');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.down('Enter');
		await page.keyboard.up('Enter');
		await new Promise(r => setTimeout(r, 200));

		let inpValue;

		page.on("console", (msg) => {
			inpValue = Number(msg.text());
			if (!inpValue) {
				return;
			}
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
			const dayPickerPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await dayPickerPage.emulateCPUThrottling(CPUThrottling);

			await dayPickerPage.tracing.start({path: filename, screenshots: false});
			await dayPickerPage.goto(`http://${serverAddr}/#/dayPicker`);
			await dayPickerPage.waitForSelector('#dayPicker');
			await new Promise(r => setTimeout(r, 200));

			await dayPickerPage.tracing.stop();


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

			if (targetEnv === 'PC') await dayPickerPage.close();
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
