/* eslint-disable no-undef */

const TestResults = require('../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../TraceModel');
const {clsValue, getFileName} = require('../utils');

describe('Picker', () => {
	const component = 'Picker';
	TestResults.newFile(component);

	describe('PickerDefault', () => {
		describe('click', () => {
			it('animates', async () => {
				await FPS();
				await page.goto('http://localhost:8080/picker');
				await page.waitForSelector('#pickerDefault');
				await page.click('[aria-label$="next item"]'); // to move mouse on the picker.
				await page.mouse.down();
				await page.waitForTimeout(200);
				await page.mouse.up();
				await page.mouse.down();
				await page.waitForTimeout(200);
				await page.mouse.up();
				await page.mouse.down();
				await page.waitForTimeout(200);
				await page.mouse.up();
				await page.mouse.down();
				await page.waitForTimeout(200);
				await page.mouse.up();

				const averageFPS = await getAverageFPS();
				TestResults.addResult({component: component, type: 'FPS Click', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

				expect(averageFPS).toBeGreaterThan(minFPS);
			});
		});

		describe('keypress', () => {
			it('animates', async () => {
				await FPS();
				await page.goto('http://localhost:8080/picker');
				await page.waitForSelector('#pickerDefault');
				await page.focus('[aria-label$="next item"]');
				await page.waitForTimeout(200);
				await page.keyboard.down('Enter');
				await page.waitForTimeout(200);
				await page.keyboard.up('Enter');
				await page.keyboard.down('Enter');
				await page.waitForTimeout(200);
				await page.keyboard.up('Enter');
				await page.keyboard.down('Enter');
				await page.waitForTimeout(200);
				await page.keyboard.up('Enter');
				await page.keyboard.down('Enter');
				await page.waitForTimeout(200);
				await page.keyboard.up('Enter');

				const averageFPS = await getAverageFPS();
				TestResults.addResult({component: component, type: 'FPS Keypress', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

				expect(averageFPS).toBeGreaterThan(minFPS);
			});
		});

		it('should have a good FID and CLS', async () => {
			await page.evaluateOnNewDocument(FID);
			await page.evaluateOnNewDocument(CLS);
			await page.goto('http://localhost:8080/picker');
			await page.waitForSelector('#pickerDefault');
			await page.waitForTimeout(100);
			await page.click('[aria-label$="next item"]');
			await page.waitForTimeout(100);

			let actualFirstInput = await page.evaluate(() => {
				return window.fid;
			});

			let actualCLS = await clsValue();

			TestResults.addResult({component: component, type: 'FID', actualValue: Math.round((actualFirstInput + Number.EPSILON) * 1000) / 1000});
			expect(actualFirstInput).toBeLessThan(maxFID);

			TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});
			expect(actualCLS).toBeLessThan(maxCLS);
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
				const page = await testMultiple.newPage();

				await page.tracing.start({path: filename, screenshots: false});
				await page.goto('http://localhost:8080/picker');
				await page.waitForSelector('#pickerDefault');
				await page.waitForTimeout(200);

				await page.tracing.stop();

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

				await page.close();
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
				await page.goto('http://localhost:8080/pickerJoined');
				await page.waitForSelector('#pickerJoined');
				await page.click('#pickerJoined'); // to move mouse on the picker.
				await page.mouse.down();
				await page.waitForTimeout(200);
				await page.mouse.up();
				await page.mouse.down();
				await page.waitForTimeout(200);
				await page.mouse.up();
				await page.mouse.down();
				await page.waitForTimeout(200);
				await page.mouse.up();
				await page.mouse.down();
				await page.waitForTimeout(200);
				await page.mouse.up();

				const averageFPS = await getAverageFPS();
				TestResults.addResult({component: component + ' joined', type: 'FPS Click', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});
			});
		});

		describe('keypress', () => {
			it('animates', async () => {
				await FPS();
				await page.goto('http://localhost:8080/pickerJoined');
				await page.waitForSelector('#pickerJoined');
				await page.focus('#pickerJoined');
				await page.waitForTimeout(200);
				await page.keyboard.down('Enter');
				await page.waitForTimeout(200);
				await page.keyboard.up('Enter');
				await page.keyboard.down('Enter');
				await page.waitForTimeout(200);
				await page.keyboard.up('Enter');
				await page.keyboard.down('Enter');
				await page.waitForTimeout(200);
				await page.keyboard.up('Enter');
				await page.keyboard.down('Enter');
				await page.waitForTimeout(200);
				await page.keyboard.up('Enter');

				const averageFPS = await getAverageFPS();
				TestResults.addResult({component: component + ' joined', type: 'FPS Keypress', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});
			});
		});

		it('should have a good FID and CLS', async () => {
			await page.evaluateOnNewDocument(FID);
			await page.evaluateOnNewDocument(CLS);
			await page.goto('http://localhost:8080/pickerJoined');
			await page.waitForSelector('#pickerJoined');
			await page.waitForTimeout(100);
			await page.click('#pickerJoined');
			await page.waitForTimeout(100);

			let actualFirstInput = await page.evaluate(() => {
				return window.fid;
			});

			let actualCLS = await clsValue();

			TestResults.addResult({component: component + ' joined', type: 'FID', actualValue: Math.round((actualFirstInput + Number.EPSILON) * 1000) / 1000});
			expect(actualFirstInput).toBeLessThan(maxFID);

			TestResults.addResult({component: component + ' joined', type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});
			expect(actualCLS).toBeLessThan(maxCLS);
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
				const page = await testMultiple.newPage();

				await page.tracing.start({path: filename, screenshots: false});
				await page.goto('http://localhost:8080/pickerJoined');
				await page.waitForSelector('#pickerJoined');
				await page.waitForTimeout(200);

				await page.tracing.stop();

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

				await page.close();
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
