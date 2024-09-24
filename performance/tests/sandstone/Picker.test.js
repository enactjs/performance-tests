/* global CPUThrottling, page, minFPS, maxCLS, stepNumber, maxDCL, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {CLS, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, getFileName, newPageMultiple} = require('../../utils');

describe('Picker', () => {
	const component = 'Picker';
	TestResults.newFile(component);

	describe('PickerDefault', () => {
		describe('click', () => {
			it('animates', async () => {
				await FPS();
				await page.goto(`http://${serverAddr}/picker`);
				await page.waitForSelector('#pickerDefault');
				await page.click('[aria-label$="next item"]'); // to move mouse on the picker.
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
				await page.goto(`http://${serverAddr}/picker`);
				await page.waitForSelector('#pickerDefault');
				await page.focus('[aria-label$="next item"]');
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
			await page.goto(`http://${serverAddr}/picker`);
			await page.waitForSelector('#pickerDefault');
			await new Promise(r => setTimeout(r, 100));
			await page.click('[aria-label$="next item"]');
			await new Promise(r => setTimeout(r, 100));

			let actualCLS = await clsValue();

			TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

			expect(actualCLS).toBeLessThan(maxCLS);
		});

		it('should have a good CLS and INP', async () => {
			await page.goto(`http://${serverAddr}/picker`);
			await page.addScriptTag({url: webVitalsURL});
			await page.waitForSelector('#pickerDefault');
			await new Promise(r => setTimeout(r, 300));
			await page.click('[aria-label$="next item"]');
			await new Promise(r => setTimeout(r, 300));

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

		it('should have a good DCL, FCP and LCP', async () => {
			const filename = getFileName(component);

			let passContDCL = 0;
			let passContFCP = 0;
			let passContLCP = 0;
			let avgDCL = 0;
			let avgFCP = 0;
			let avgLCP = 0;
			for (let step = 0; step < stepNumber; step++) {
				const pickerPage = targetEnv === 'TV' ? page : await newPageMultiple();
				await pickerPage.emulateCPUThrottling(CPUThrottling);

				await pickerPage.tracing.start({path: filename, screenshots: false});
				await pickerPage.goto(`http://${serverAddr}/picker`);
				await pickerPage.waitForSelector('#pickerDefault');
				await new Promise(r => setTimeout(r, 200));

				await pickerPage.tracing.stop();

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

				if (targetEnv === 'PC') await pickerPage.close();
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

	describe('PickerJoined', () => {
		describe('click', () => {
			it('animates', async () => {
				await FPS();
				await page.goto(`http://${serverAddr}/pickerJoined`);
				await page.waitForSelector('#pickerJoined');
				await page.click('#pickerJoined'); // to move mouse on the picker.
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
				await page.goto(`http://${serverAddr}/pickerJoined`);
				await page.waitForSelector('#pickerJoined');
				await page.focus('#pickerJoined');
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
			await page.goto(`http://${serverAddr}/pickerJoined`);
			await page.waitForSelector('#pickerJoined');
			await new Promise(r => setTimeout(r, 100));
			await page.click('#pickerJoined');
			await new Promise(r => setTimeout(r, 100));

			let actualCLS = await clsValue();

			TestResults.addResult({component: component + ' joined', type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

			expect(actualCLS).toBeLessThan(maxCLS);
		});

		it('should have a good CLS and INP', async () => {
			await page.goto(`http://${serverAddr}/pickerJoined`);
			await page.addScriptTag({url: webVitalsURL});
			await page.waitForSelector('#pickerJoined');
			await new Promise(r => setTimeout(r, 300));
			await page.click('#pickerJoined');
			await new Promise(r => setTimeout(r, 300));

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

		it('should have a good DCL, FCP and LCP', async () => {
			const filename = getFileName(component);

			let passContDCL = 0;
			let passContFCP = 0;
			let passContLCP = 0;
			let avgDCL = 0;
			let avgFCP = 0;
			let avgLCP = 0;
			for (let step = 0; step < stepNumber; step++) {
				const pickerJoinedPage = targetEnv === 'TV' ? page : await newPageMultiple();
				await pickerJoinedPage.emulateCPUThrottling(CPUThrottling);

				await pickerJoinedPage.tracing.start({path: filename, screenshots: false});
				await pickerJoinedPage.goto(`http://${serverAddr}/pickerJoined`);
				await pickerJoinedPage.waitForSelector('#pickerJoined');
				await new Promise(r => setTimeout(r, 200));

				await pickerJoinedPage.tracing.stop();

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

				if (targetEnv === 'PC') await pickerJoinedPage.close();
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
