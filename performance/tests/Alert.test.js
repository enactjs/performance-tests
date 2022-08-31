/* global page, minFPS, maxFID, maxFID, stepNumber, testMultiple, maxDCL, maxFCP, maxLCP, maxCLS, passRatio, serverAddr */

const TestResults = require('../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../TraceModel');
const {clsValue, firstInputValue, getFileName} = require('../utils');

describe('Alert', () => {
	const component = 'Alert';
	TestResults.newFile(component);

	describe('click', () => {
		it('animates', async () => {
			await FPS();
			await pageTV.goto(`http://${serverAddr}/alert`);

			await pageTV.waitForTimeout(500);

			await pageTV.click('#button'); // to move mouse on the button.
			await pageTV.mouse.down();
			await pageTV.waitForTimeout(200);
			await pageTV.mouse.up();
			await pageTV.mouse.down();
			await pageTV.waitForTimeout(200);
			await pageTV.mouse.up();
			await pageTV.mouse.down();
			await pageTV.waitForTimeout(200);
			await pageTV.mouse.up();
			await pageTV.mouse.down();
			await pageTV.waitForTimeout(200);
			await pageTV.mouse.up();

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Click', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	describe('keypress', () => {
		it('animates', async () => {
			await FPS();
			await pageTV.goto(`http://${serverAddr}/alert`);
			await pageTV.waitForSelector('#button');
			await pageTV.focus('#button');
			await pageTV.waitForTimeout(200);
			await pageTV.keyboard.down('Enter');
			await pageTV.waitForTimeout(200);
			await pageTV.keyboard.up('Enter');
			await pageTV.keyboard.down('Enter');
			await pageTV.waitForTimeout(200);
			await pageTV.keyboard.up('Enter');
			await pageTV.keyboard.down('Enter');
			await pageTV.waitForTimeout(200);
			await pageTV.keyboard.up('Enter');
			await pageTV.keyboard.down('Enter');
			await pageTV.waitForTimeout(200);
			await pageTV.keyboard.up('Enter');

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS keypress', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	it('should have a good FID and CLS', async () => {
		await pageTV.evaluateOnNewDocument(FID);
		await pageTV.evaluateOnNewDocument(CLS);
		await pageTV.goto(`http://${serverAddr}/alert`);
		await pageTV.waitForSelector('#button');
		await pageTV.focus('#button');
		await pageTV.keyboard.down('Enter');

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
			//const alertPage = await testMultiple.newPage();

			await pageTV.tracing.start({path: filename, screenshots: false});
			await pageTV.goto(`http://${serverAddr}/alert`);
			await pageTV.waitForSelector('#alert');
			await pageTV.waitForTimeout(200);

			await pageTV.tracing.stop();

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

			//await pageTV.close();
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
