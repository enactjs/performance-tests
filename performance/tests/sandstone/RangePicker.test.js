/* global CPUThrottling, page, minFPS, maxCLS, stepNumber, maxDCL, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {CLS, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, getFileName, newPageMultiple} = require('../../utils');

describe('RangePicker', () => {
	const component = 'RangePicker';
	TestResults.newFile(component);

	describe('RangePickerDefault', () => {
		describe('click', () => {
			it('animates', async () => {
				await FPS();
				await page.goto(`http://${serverAddr}/rangePicker`);
				await page.waitForSelector('#rangePickerDefault');
				await page.click('[aria-label$="press ok button to increase the value"]'); // to move mouse on the rangePicker.
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
				await page.goto(`http://${serverAddr}/rangePicker`);
				await page.waitForSelector('#rangePickerDefault');
				await page.focus('[aria-label$="press ok button to increase the value"]');
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
			await page.goto(`http://${serverAddr}/rangePicker`);
			await page.waitForSelector('#rangePickerDefault');
			await new Promise(r => setTimeout(r, 100));
			await page.click('[aria-label$="press ok button to increase the value"]');
			await new Promise(r => setTimeout(r, 100));

			let actualCLS = await clsValue();

			TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

			expect(actualCLS).toBeLessThan(maxCLS);
		});

		it('should have a good INP', async () => {
			await page.goto(`http://${serverAddr}/rangePicker`);
			await page.addScriptTag({url: webVitalsURL});
			await page.waitForSelector('#rangePickerDefault');
			await new Promise(r => setTimeout(r, 300));
			await page.click('[aria-label$="press ok button to increase the value"]');
			await new Promise(r => setTimeout(r, 300));

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
				const rangePickerPage = targetEnv === 'TV' ? page : await newPageMultiple();
				await rangePickerPage.emulateCPUThrottling(CPUThrottling);

				await rangePickerPage.tracing.start({path: filename, screenshots: false});
				await rangePickerPage.goto(`http://${serverAddr}/rangePicker`);
				await rangePickerPage.waitForSelector('#rangePickerDefault');
				await new Promise(r => setTimeout(r, 200));

				await rangePickerPage.tracing.stop();

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

				if (targetEnv === 'PC') await rangePickerPage.close();
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

	describe('RangePickerJoined', () => {
		describe('click', () => {
			it('animates', async () => {
				await FPS();
				await page.goto(`http://${serverAddr}/rangePickerJoined`);
				await page.waitForSelector('#rangePickerJoined');
				await page.click('#rangePickerJoined'); // to move mouse on the rangePicker.
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
				TestResults.addResult({component: component + ' joined', type: 'FPS Click', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});
			});
		});

		describe('keypress', () => {
			it('animates', async () => {
				await FPS();
				await page.goto(`http://${serverAddr}/rangePickerJoined`);
				await page.waitForSelector('#rangePickerJoined');
				await page.focus('#rangePickerJoined');
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
				TestResults.addResult({component: component + ' joined', type: 'FPS Keypress', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});
			});
		});

		it('should have a good CLS', async () => {
			await page.evaluateOnNewDocument(CLS);
			await page.goto(`http://${serverAddr}/rangePickerJoined`);
			await page.waitForSelector('#rangePickerJoined');
			await new Promise(r => setTimeout(r, 100));
			await page.click('#rangePickerJoined');
			await new Promise(r => setTimeout(r, 100));

			let actualCLS = await clsValue();

			TestResults.addResult({component: component + ' joined', type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

			expect(actualCLS).toBeLessThan(maxCLS);
		});

		it('should have a good INP', async () => {
			await page.goto(`http://${serverAddr}/rangePickerJoined`);
			await page.addScriptTag({url: webVitalsURL});
			await page.waitForSelector('#rangePickerJoined');
			await new Promise(r => setTimeout(r, 300));
			await page.click('#rangePickerJoined');
			await new Promise(r => setTimeout(r, 300));
			await page.click('#rangePickerJoined');
			await new Promise(r => setTimeout(r, 300));

			let inpValue;

			page.on("console", (msg) => {
				inpValue = Number(msg.text());
				TestResults.addResult({component: component + ' joined', type: 'INP', actualValue: Math.round((inpValue + Number.EPSILON) * 1000) / 1000});
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
				const rangePickerJoinedPage = targetEnv === 'TV' ? page : await newPageMultiple();
				await rangePickerJoinedPage.emulateCPUThrottling(CPUThrottling);

				await rangePickerJoinedPage.tracing.start({path: filename, screenshots: false});
				await rangePickerJoinedPage.goto(`http://${serverAddr}/rangePickerJoined`);
				await rangePickerJoinedPage.waitForSelector('#rangePickerJoined');
				await new Promise(r => setTimeout(r, 200));

				await rangePickerJoinedPage.tracing.stop();

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

				if (targetEnv === 'PC') await rangePickerJoinedPage.close();
			}
			avgDCL = avgDCL / stepNumber;
			avgFCP = avgFCP / stepNumber;
			avgLCP = avgLCP / stepNumber;

			TestResults.addResult({component: component + ' joined', type: 'DCL', actualValue: Math.round((avgDCL + Number.EPSILON) * 1000) / 1000});
			TestResults.addResult({component: component + ' joined', type: 'FCP', actualValue: Math.round((avgFCP + Number.EPSILON) * 1000) / 1000});
			TestResults.addResult({component: component + ' joined', type: 'LCP', actualValue: Math.round((avgLCP + Number.EPSILON) * 1000) / 1000});

			expect(passContDCL).toBeGreaterThan(passRatio * stepNumber);
			expect(avgDCL).toBeLessThan(maxDCL);

			expect(passContFCP).toBeGreaterThan(passRatio * stepNumber);
			expect(avgFCP).toBeLessThan(maxFCP);

			expect(passContLCP).toBeGreaterThan(passRatio * stepNumber);
			expect(avgLCP).toBeLessThan(maxLCP);
		});
	});
});
