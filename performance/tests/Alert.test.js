/* global page, minFPS, maxFID, maxFID, stepNumber, testMultiple, maxDCL, maxFCP, maxLCP, maxCLS, passRatio, serverAddr, targetEnv */

const TestResults = require('../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../TraceModel');
const {clsValue, firstInputValue, getFileName} = require('../utils');

describe('Alert', () => {
	const component = 'Alert';
	TestResults.newFile(component);

	describe('click', () => {
		it('animates', async () => {
			const alertPage = targetEnv === 'TV' ? pageTV : page;
			await FPS();
			await alertPage.goto(`http://${serverAddr}/alert`);

			await alertPage.waitForTimeout(500);

			await alertPage.click('#button'); // to move mouse on the button.
			await alertPage.mouse.down();
			await alertPage.waitForTimeout(200);
			await alertPage.mouse.up();
			await alertPage.mouse.down();
			await alertPage.waitForTimeout(200);
			await alertPage.mouse.up();
			await alertPage.mouse.down();
			await alertPage.waitForTimeout(200);
			await alertPage.mouse.up();
			await alertPage.mouse.down();
			await alertPage.waitForTimeout(200);
			await alertPage.mouse.up();

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Click', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	describe('keypress', () => {
		it('animates', async () => {
			const alertPage = targetEnv === 'TV' ? pageTV : page;
			await FPS();
			await alertPage.goto(`http://${serverAddr}/alert`);
			await alertPage.waitForSelector('#button');
			await alertPage.focus('#button');
			await alertPage.waitForTimeout(200);
			await alertPage.keyboard.down('Enter');
			await alertPage.waitForTimeout(200);
			await alertPage.keyboard.up('Enter');
			await alertPage.keyboard.down('Enter');
			await alertPage.waitForTimeout(200);
			await alertPage.keyboard.up('Enter');
			await alertPage.keyboard.down('Enter');
			await alertPage.waitForTimeout(200);
			await alertPage.keyboard.up('Enter');
			await alertPage.keyboard.down('Enter');
			await alertPage.waitForTimeout(200);
			await alertPage.keyboard.up('Enter');

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS keypress', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	it('should have a good FID and CLS', async () => {
		const alertPage = targetEnv === 'TV' ? pageTV : page;
		await alertPage.evaluateOnNewDocument(FID);
		await alertPage.evaluateOnNewDocument(CLS);
		await alertPage.goto(`http://${serverAddr}/alert`);
		await alertPage.waitForSelector('#button');
		await alertPage.focus('#button');
		await alertPage.keyboard.down('Enter');

		let actualFirstInput = await firstInputValue();
		let actualCLS = await clsValue();

		TestResults.addResult({component: component, type: 'FID', actualValue: Math.round((actualFirstInput + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

		expect(actualFirstInput).toBeLessThan(maxFID);
		expect(actualCLS).toBeLessThan(maxCLS);
	});

	it('should have a good DCL, FCP and LCP', async () => {
		const alertPage = targetEnv === 'TV' ? pageTV : page;
		const filename = getFileName(component);

		let passContDCL = 0;
		let passContFCP = 0;
		let passContLCP = 0;
		let avgDCL = 0;
		let avgFCP = 0;
		let avgLCP = 0;
		for (let step = 0; step < stepNumber; step++) {
			const alertMultiplePage = targetEnv === 'TV' ? alertPage : await testMultiple.newPage();

			await alertMultiplePage.tracing.start({path: filename, screenshots: false});
			await alertMultiplePage.goto(`http://${serverAddr}/alert`);
			await alertMultiplePage.waitForSelector('#alert');
			await alertMultiplePage.waitForTimeout(200);

			await alertMultiplePage.tracing.stop();

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

			if (targetEnv === 'PC') await alertMultiplePage.close();
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
