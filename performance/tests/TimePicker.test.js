/* global page, minFPS, maxFID, maxCLS, stepNumber, testMultiple, maxDCL, maxFCP, maxLCP, passRatio, serverAddr, targetEnv */

const TestResults = require('../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../TraceModel');
const {clsValue, firstInputValue, getFileName} = require('../utils');

describe('TimePicker', () => {
	const component = 'TimePicker';
	TestResults.newFile(component);

	describe('click', () => {
		it('animates', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/timePicker`);
			await page.waitForSelector('#timePicker');
			await page.waitForTimeout(200);
			await page.click('[aria-label$="hour change a value with up down button"]');
			await page.waitForTimeout(1000);

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Click', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	describe('keypress', () => {
		it('animates', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/timePicker`);
			await page.waitForSelector('#timePicker');
			await page.focus('[aria-label$="hour change a value with up down button"]');
			await page.waitForTimeout(200);
			await page.keyboard.down('ArrowDown');
			await page.waitForTimeout(200);

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Keypress', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	it('should have a good FID and CLS', async () => {
		await page.evaluateOnNewDocument(FID);
		await page.evaluateOnNewDocument(CLS);
		await page.goto(`http://${serverAddr}/timePicker`);
		await page.waitForSelector('#timePicker');
		await page.focus('[aria-label$="hour change a value with up down button"]');
		await page.keyboard.down('ArrowDown');

		let actualFirstInput = await firstInputValue();
		let actualCLS = await clsValue();

		TestResults.addResult({component: component, type: 'FID', actualValue: Math.round((actualFirstInput + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

		expect(actualFirstInput).toBeLessThan(maxFID);
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
			const timePickerPage = await testMultiple.newPage();

			await timePickerPage.tracing.start({path: filename, screenshots: false});
			await timePickerPage.goto(`http://${serverAddr}/timePicker`);
			await timePickerPage.waitForSelector('#timePicker');
			await timePickerPage.waitForTimeout(200);

			await timePickerPage.tracing.stop();

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

			if (targetEnv === 'PC') await timePickerPage.close();
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
