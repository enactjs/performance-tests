const TestResults = require('../TestResults');
const {CLS, DCL, FCP, FID, FPS, LCP} = require('../TraceModel');
const {clsValue, firstInputValue, getFileName} = require('../utils');

describe('RangePicker', () => {
	const component = 'RangePicker';
	TestResults.newFile(component);

	describe('RangePickerDefault', () => {
		describe('click', () => {
			it('animates', async () => {
				const FPSValues = await FPS();
				await page.goto('http://localhost:8080/rangePicker');
				await page.waitForSelector('#rangePickerDefault');
				await page.click('[aria-label$="press ok button to increase the value"]'); // to move mouse on the rangePicker.
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

				const averageFPS = (FPSValues.reduce((a, b) => a + b, 0) / FPSValues.length) || 0;
				TestResults.addResult({component: component, type: 'Frames Per Second Click', actualValue: averageFPS});
			});
		});

		describe('keypress', () => {
			it('animates', async () => {
				const FPSValues = await FPS();
				await page.goto('http://localhost:8080/rangePicker');
				await page.waitForSelector('#rangePickerDefault');
				await page.focus('[aria-label$="press ok button to increase the value"]');
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

				const averageFPS = (FPSValues.reduce((a, b) => a + b, 0) / FPSValues.length) || 0;
				TestResults.addResult({component: component, type: 'Frames Per Second Keypress', actualValue: averageFPS});
			});
		});

		it('should have a good FID and CLS', async () => {
			await page.evaluateOnNewDocument(FID);
			await page.evaluateOnNewDocument(CLS);
			await page.goto('http://localhost:8080/rangePicker');
			await page.waitForSelector('#rangePickerDefault');
			await page.waitForTimeout(100);
			await page.click('[aria-label$="press ok button to increase the value"]');
			await page.waitForTimeout(100);

			let actualFirstInput = await page.evaluate(() => {
				return window.fid;
			});

			let actualCLS = await page.evaluate(() => {
				return window.cls;
			});

			TestResults.addResult({component: component, type: 'First Input Delay', actualValue: actualFirstInput});
			expect(actualFirstInput).toBeLessThan(maxFID);

			TestResults.addResult({component: component, type: 'CLS', actualValue: actualCLS});
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
				await page.goto('http://localhost:8080/rangePicker');
				await page.waitForSelector('#rangePickerDefault');
				await page.waitForTimeout(200);

				await page.tracing.stop();

				const actualDCL = await DCL(filename);
				avgDCL = avgDCL + actualDCL;
				if (actualDCL < maxDCL) {
					passContDCL += 1;
				}

				const actualFCP = await FCP(filename);
				avgFCP = avgFCP + actualFCP;
				if (actualFCP < maxFCP) {
					passContFCP += 1;
				}

				const actualLCP = await LCP(filename);
				avgLCP = avgLCP + actualLCP;
				if (actualLCP < maxLCP) {
					passContLCP += 1;
				}

				await page.close();
			}
			avgDCL = avgDCL / stepNumber;
			avgFCP = avgFCP / stepNumber;
			avgLCP = avgLCP / stepNumber;

			TestResults.addResult({component: component, type: 'average DCL', actualValue: avgDCL});
			TestResults.addResult({component: component, type: 'average FCP', actualValue: avgFCP});
			TestResults.addResult({component: component, type: 'average LCP', actualValue: avgLCP});

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
				const FPSValues = await FPS();
				await page.goto('http://localhost:8080/rangePickerJoined');
				await page.waitForSelector('#rangePickerJoined');
				await page.click('#rangePickerJoined'); // to move mouse on the rangePicker.
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

				const averageFPS = (FPSValues.reduce((a, b) => a + b, 0) / FPSValues.length) || 0;
				TestResults.addResult({component: component + ' joined', type: 'Frames Per Second Click', actualValue: averageFPS});
			});
		});

		describe('keypress', () => {
			it('animates', async () => {
				const FPSValues = await FPS();
				await page.goto('http://localhost:8080/rangePickerJoined');
				await page.waitForSelector('#rangePickerJoined');
				await page.focus('#rangePickerJoined');
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

				const averageFPS = (FPSValues.reduce((a, b) => a + b, 0) / FPSValues.length) || 0;
				TestResults.addResult({component: component + ' joined', type: 'Frames Per Second Keypress', actualValue: averageFPS});
			});
		});

		it('should have a good FID and CLS', async () => {
			await page.evaluateOnNewDocument(FID);
			await page.evaluateOnNewDocument(CLS);
			await page.goto('http://localhost:8080/rangePickerJoined');
			await page.waitForSelector('#rangePickerJoined');
			await page.waitForTimeout(100);
			await page.click('#rangePickerJoined');
			await page.waitForTimeout(100);

			let actualFirstInput = await page.evaluate(() => {
				return window.fid;
			});

			let actualCLS = await page.evaluate(() => {
				return window.cls;
			});

			TestResults.addResult({component: component + ' joined', type: 'First Input Delay', actualValue: actualFirstInput});
			expect(actualFirstInput).toBeLessThan(maxFID);

			TestResults.addResult({component: component + ' joined', type: 'CLS', actualValue: actualCLS});
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
				await page.goto('http://localhost:8080/rangePickerJoined');
				await page.waitForSelector('#rangePickerJoined');
				await page.waitForTimeout(200);

				await page.tracing.stop();

				const actualDCL = await DCL(filename);
				avgDCL = avgDCL + actualDCL;
				if (actualDCL < maxDCL) {
					passContDCL += 1;
				}

				const actualFCP = await FCP(filename);
				avgFCP = avgFCP + actualFCP;
				if (actualFCP < maxFCP) {
					passContFCP += 1;
				}

				const actualLCP = await LCP(filename);
				avgLCP = avgLCP + actualLCP;
				if (actualLCP < maxLCP) {
					passContLCP += 1;
				}

				await page.close();
			}
			avgDCL = avgDCL / stepNumber;
			avgFCP = avgFCP / stepNumber;
			avgLCP = avgLCP / stepNumber;

			TestResults.addResult({component: component + ' joined', type: 'average DCL', actualValue: avgDCL});
			TestResults.addResult({component: component + ' joined', type: 'average FCP', actualValue: avgFCP});
			TestResults.addResult({component: component + ' joined', type: 'average LCP', actualValue: avgLCP});

			expect(passContDCL).toBeGreaterThan(passRatio * stepNumber);
			expect(avgDCL).toBeLessThan(maxDCL);

			expect(passContFCP).toBeGreaterThan(passRatio * stepNumber);
			expect(avgFCP).toBeLessThan(maxFCP);

			expect(passContLCP).toBeGreaterThan(passRatio * stepNumber);
			expect(avgLCP).toBeLessThan(maxLCP);
		});
	});
});
