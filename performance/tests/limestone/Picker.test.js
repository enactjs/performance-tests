/* global CPUThrottling, page, minFPS, maxCLS, stepNumber, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {FPS, getAverageFPS} = require('../../TraceModel');
const {newPageMultiple} = require("../../utils");

describe('Picker', () => {
	const component = 'Picker';
	TestResults.newFile(component);

	describe('PickerDefault', () => {
		describe('click', () => {
			it('animates', async () => {
				await FPS();
				await page.goto(`http://${serverAddr}/#/picker`);
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
				await page.goto(`http://${serverAddr}/#/picker`);
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

		it('should have a good CLS, FCP, INP and LCP', async () => {
			let passContCLS = 0;
			let passContINP = 0;
			let passContFCP = 0;
			let passContLCP = 0;
			let avgCLS = 0;
			let avgINP = 0;
			let avgFCP = 0;
			let avgLCP = 0;
			for (let step = 0; step < stepNumber; step++) {
				const pickerPage = targetEnv === 'TV' ? page : await newPageMultiple();
				await pickerPage.emulateCPUThrottling(CPUThrottling);
				await pickerPage.goto(`http://${serverAddr}/#/picker`);
				await pickerPage.addScriptTag({url: webVitalsURL});
				await pickerPage.waitForSelector('#pickerDefault');
				await new Promise(r => setTimeout(r, 300));
				await pickerPage.click('[aria-label$="next item"]');
				await new Promise(r => setTimeout(r, 300));

				pickerPage.on("console", (msg) => {
					let jsonMsg = JSON.parse(msg.text());

					if (jsonMsg.name === 'CLS') {
						avgCLS = avgCLS + jsonMsg.value;
						if (jsonMsg.value < maxCLS) {
							passContCLS += 1;
						}
					} else if (jsonMsg.name === 'INP') {
						avgINP = avgINP + jsonMsg.value;
						if (jsonMsg.value < maxINP) {
							passContINP += 1;
						}
					} else if (jsonMsg.name === 'FCP') {
						avgFCP = avgFCP + jsonMsg.value;
						if (jsonMsg.value < maxFCP) {
							passContFCP += 1;
						}
					} else if (jsonMsg.name === 'LCP') {
						avgLCP = avgLCP + jsonMsg.value;
						if (jsonMsg.value < maxLCP) {
							passContLCP += 1;
						}
					}
				});

				await pickerPage.evaluateHandle(() => {
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
				if (targetEnv === 'PC') await pickerPage.close();
			}

			avgCLS = avgCLS / stepNumber;
			avgINP = avgINP / stepNumber;
			avgFCP = avgFCP / stepNumber;
			avgLCP = avgLCP / stepNumber;

			TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((avgCLS + Number.EPSILON) * 1000) / 1000});
			TestResults.addResult({component: component, type: 'INP', actualValue: Math.round((avgINP + Number.EPSILON) * 1000) / 1000});
			TestResults.addResult({component: component, type: 'FCP', actualValue: Math.round((avgFCP + Number.EPSILON) * 1000) / 1000});
			TestResults.addResult({component: component, type: 'LCP', actualValue: Math.round((avgLCP + Number.EPSILON) * 1000) / 1000});

			expect(avgCLS).toBeLessThan(maxCLS);
			expect(avgINP).toBeLessThan(maxINP);
			expect(avgFCP).toBeLessThan(maxFCP);
			expect(avgLCP).toBeLessThan(maxLCP);

			expect(passContCLS).toBeGreaterThan(passRatio * stepNumber);
			expect(passContINP).toBeGreaterThan(passRatio * stepNumber);
			expect(passContFCP).toBeGreaterThan(passRatio * stepNumber);
			expect(passContLCP).toBeGreaterThan(passRatio * stepNumber);
		});
	});

	describe('PickerJoined', () => {
		describe('click', () => {
			it('animates', async () => {
				await FPS();
				await page.goto(`http://${serverAddr}/#/pickerJoined`);
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
				await page.goto(`http://${serverAddr}/#/pickerJoined`);
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

		it('should have a good CLS, FCP, INP and LCP', async () => {
			let passContCLS = 0;
			let passContINP = 0;
			let passContFCP = 0;
			let passContLCP = 0;
			let avgCLS = 0;
			let avgINP = 0;
			let avgFCP = 0;
			let avgLCP = 0;
			for (let step = 0; step < stepNumber; step++) {
				const pickerPage = targetEnv === 'TV' ? page : await newPageMultiple();
				await pickerPage.emulateCPUThrottling(CPUThrottling);
				await pickerPage.goto(`http://${serverAddr}/#/pickerJoined`);
				await pickerPage.addScriptTag({url: webVitalsURL});
				await pickerPage.waitForSelector('#pickerJoined');
				await new Promise(r => setTimeout(r, 300));
				await pickerPage.click('#pickerJoined');
				await new Promise(r => setTimeout(r, 300));

				pickerPage.on("console", (msg) => {
					let jsonMsg = JSON.parse(msg.text());

					if (jsonMsg.name === 'CLS') {
						avgCLS = avgCLS + jsonMsg.value;
						if (jsonMsg.value < maxCLS) {
							passContCLS += 1;
						}
					} else if (jsonMsg.name === 'INP') {
						avgINP = avgINP + jsonMsg.value;
						if (jsonMsg.value < maxINP) {
							passContINP += 1;
						}
					} else if (jsonMsg.name === 'FCP') {
						avgFCP = avgFCP + jsonMsg.value;
						if (jsonMsg.value < maxFCP) {
							passContFCP += 1;
						}
					} else if (jsonMsg.name === 'LCP') {
						avgLCP = avgLCP + jsonMsg.value;
						if (jsonMsg.value < maxLCP) {
							passContLCP += 1;
						}
					}
				});

				await pickerPage.evaluateHandle(() => {
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
				if (targetEnv === 'PC') await pickerPage.close();
			}

			avgCLS = avgCLS / stepNumber;
			avgINP = avgINP / stepNumber;
			avgFCP = avgFCP / stepNumber;
			avgLCP = avgLCP / stepNumber;

			TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((avgCLS + Number.EPSILON) * 1000) / 1000});
			TestResults.addResult({component: component, type: 'INP', actualValue: Math.round((avgINP + Number.EPSILON) * 1000) / 1000});
			TestResults.addResult({component: component, type: 'FCP', actualValue: Math.round((avgFCP + Number.EPSILON) * 1000) / 1000});
			TestResults.addResult({component: component, type: 'LCP', actualValue: Math.round((avgLCP + Number.EPSILON) * 1000) / 1000});

			expect(avgCLS).toBeLessThan(maxCLS);
			expect(avgINP).toBeLessThan(maxINP);
			expect(avgFCP).toBeLessThan(maxFCP);
			expect(avgLCP).toBeLessThan(maxLCP);

			expect(passContCLS).toBeGreaterThan(passRatio * stepNumber);
			expect(passContINP).toBeGreaterThan(passRatio * stepNumber);
			expect(passContFCP).toBeGreaterThan(passRatio * stepNumber);
			expect(passContLCP).toBeGreaterThan(passRatio * stepNumber);
		});
	});
});
