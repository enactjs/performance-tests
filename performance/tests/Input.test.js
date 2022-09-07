/* global page, minFPS, maxFID, maxCLS, stepNumber, testMultiple, maxDCL, maxFCP, maxLCP, passRatio, serverAddr, targetEnv */

const TestResults = require('../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../TraceModel');
const {clsValue, firstInputValue, getFileName} = require('../utils');

describe('Input', () => {
	const component = 'Input';
	TestResults.newFile(component);

	it('FPS', async () => {
		await FPS();
		await inputPage.goto(`http://${serverAddr}/input`);
		await inputPage.waitForSelector('.inputView');
		await inputPage.focus('.inputView');
		await inputPage.waitForTimeout(200);
		await inputPage.keyboard.down('Enter');
		await inputPage.waitForTimeout(200);
		await inputPage.keyboard.up('Enter');
		await inputPage.keyboard.down('A');
		await inputPage.keyboard.up('A');
		await inputPage.keyboard.down('B');
		await inputPage.keyboard.up('B');
		await inputPage.keyboard.down('B');
		await inputPage.keyboard.up('B');
		await inputPage.keyboard.down('A');
		await inputPage.keyboard.up('A');
		await inputPage.keyboard.down('Backspace');
		await inputPage.keyboard.up('Backspace');
		await inputPage.keyboard.down('Backspace');
		await inputPage.keyboard.up('Backspace');
		await inputPage.keyboard.down('Enter');
		await inputPage.waitForTimeout(200);
		await inputPage.keyboard.up('Enter');
		await inputPage.keyboard.down('A');
		await inputPage.keyboard.up('A');
		await inputPage.keyboard.down('B');
		await inputPage.keyboard.up('B');
		await inputPage.keyboard.down('B');
		await inputPage.keyboard.up('B');
		await inputPage.keyboard.down('A');
		await inputPage.keyboard.up('A');
		await inputPage.keyboard.down('Backspace');
		await inputPage.keyboard.up('Backspace');
		await inputPage.keyboard.down('Backspace');
		await inputPage.keyboard.up('Backspace');
		await inputPage.keyboard.down('Enter');
		await inputPage.waitForTimeout(200);
		await inputPage.keyboard.up('Enter');
		await inputPage.keyboard.down('A');
		await inputPage.keyboard.up('A');
		await inputPage.keyboard.down('B');
		await inputPage.keyboard.up('B');
		await inputPage.keyboard.down('B');
		await inputPage.keyboard.up('B');
		await inputPage.keyboard.down('A');
		await inputPage.keyboard.up('A');
		await inputPage.keyboard.down('Backspace');
		await inputPage.keyboard.up('Backspace');
		await inputPage.keyboard.down('Backspace');
		await inputPage.keyboard.up('Backspace');
		await inputPage.keyboard.down('Enter');
		await inputPage.waitForTimeout(200);
		await inputPage.keyboard.up('Enter');

		const averageFPS = await getAverageFPS();
		TestResults.addResult({component: component, type: 'FPS', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

		expect(averageFPS).toBeGreaterThan(minFPS);
	});

	it('should have a good FID and CLS', async () => {
		await inputPage.evaluateOnNewDocument(FID);
		await inputPage.evaluateOnNewDocument(CLS);
		await inputPage.goto(`http://${serverAddr}/input`);
		await inputPage.waitForSelector('.inputView');
		await inputPage.waitForTimeout(100);
		await inputPage.click('.inputView');
		await inputPage.waitForTimeout(100);
		await inputPage.keyboard.down('A');
		await inputPage.keyboard.up('A');
		await inputPage.keyboard.down('B');
		await inputPage.keyboard.up('B');
		await inputPage.keyboard.down('B');
		await inputPage.keyboard.up('B');
		await inputPage.keyboard.down('A');
		await inputPage.keyboard.up('A');
		await inputPage.keyboard.down('Backspace');
		await inputPage.keyboard.up('Backspace');
		await inputPage.keyboard.down('Backspace');
		await inputPage.keyboard.up('Backspace');

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
			const inputPage = await testMultiple.newPage();

			await inputPage.tracing.start({path: filename, screenshots: false});
			await inputPage.goto(`http://${serverAddr}/input`);
			await inputPage.waitForSelector('.inputView');
			await inputPage.waitForTimeout(200);

			await inputPage.tracing.stop();

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

			if (targetEnv === 'PC') await inputPage.close();
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
