/* global CPUThrottling, page, minFPS, maxFID, maxCLS, stepNumber, maxDCL, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals */

const TestResults = require('../../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, firstInputValue, getFileName, newPageMultiple} = require('../../utils');

describe('Input', () => {
	const component = 'Input';
	TestResults.newFile(component);

	it('FPS', async () => {
		await FPS();
		await page.goto(`http://${serverAddr}/input`);
		await page.waitForSelector('#input');
		await page.focus('#input');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.down('Enter');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.up('Enter');
		await page.keyboard.down('A');
		await page.keyboard.up('A');
		await page.keyboard.down('B');
		await page.keyboard.up('B');
		await page.keyboard.down('B');
		await page.keyboard.up('B');
		await page.keyboard.down('A');
		await page.keyboard.up('A');
		await page.keyboard.down('Backspace');
		await page.keyboard.up('Backspace');
		await page.keyboard.down('Backspace');
		await page.keyboard.up('Backspace');
		await page.keyboard.down('Enter');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.up('Enter');
		await page.keyboard.down('A');
		await page.keyboard.up('A');
		await page.keyboard.down('B');
		await page.keyboard.up('B');
		await page.keyboard.down('B');
		await page.keyboard.up('B');
		await page.keyboard.down('A');
		await page.keyboard.up('A');
		await page.keyboard.down('Backspace');
		await page.keyboard.up('Backspace');
		await page.keyboard.down('Backspace');
		await page.keyboard.up('Backspace');
		await page.keyboard.down('Enter');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.up('Enter');
		await page.keyboard.down('A');
		await page.keyboard.up('A');
		await page.keyboard.down('B');
		await page.keyboard.up('B');
		await page.keyboard.down('B');
		await page.keyboard.up('B');
		await page.keyboard.down('A');
		await page.keyboard.up('A');
		await page.keyboard.down('Backspace');
		await page.keyboard.up('Backspace');
		await page.keyboard.down('Backspace');
		await page.keyboard.up('Backspace');
		await page.keyboard.down('Enter');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.up('Enter');

		const averageFPS = await getAverageFPS();
		TestResults.addResult({component: component, type: 'FPS', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

		expect(averageFPS).toBeGreaterThan(minFPS);
	});

	it('should have a good FID and CLS', async () => {
		await page.evaluateOnNewDocument(FID);
		await page.evaluateOnNewDocument(CLS);
		await page.goto(`http://${serverAddr}/input`);
		await page.waitForSelector('#input');
		await new Promise(r => setTimeout(r, 100));
		await page.click('#input');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('A');
		await page.keyboard.up('A');
		await page.keyboard.down('B');
		await page.keyboard.up('B');
		await page.keyboard.down('B');
		await page.keyboard.up('B');
		await page.keyboard.down('A');
		await page.keyboard.up('A');
		await page.keyboard.down('Backspace');
		await page.keyboard.up('Backspace');
		await page.keyboard.down('Backspace');
		await page.keyboard.up('Backspace');

		let actualFirstInput = await firstInputValue();
		let actualCLS = await clsValue();

		TestResults.addResult({component: component, type: 'FID', actualValue: Math.round((actualFirstInput + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

		expect(actualFirstInput).toBeLessThan(maxFID);
		expect(actualCLS).toBeLessThan(maxCLS);
	});

	it('should have a good INP', async () => {
		await page.goto(`http://${serverAddr}/input`);
		await page.addScriptTag({url: 'https://unpkg.com/web-vitals@4/dist/web-vitals.iife.js'});
		await page.waitForSelector('#input');
		await new Promise(r => setTimeout(r, 100));
		await page.click('#input');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('A');
		await page.keyboard.up('A');
		await page.keyboard.down('B');
		await page.keyboard.up('B');
		await page.keyboard.down('B');
		await page.keyboard.up('B');
		await page.keyboard.down('A');
		await page.keyboard.up('A');
		await page.keyboard.down('Backspace');
		await page.keyboard.up('Backspace');
		await page.keyboard.down('Backspace');
		await page.keyboard.up('Backspace');
		await new Promise(r => setTimeout(r, 1000));

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
			const inputPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await inputPage.emulateCPUThrottling(CPUThrottling);

			await inputPage.tracing.start({path: filename, screenshots: false});
			await inputPage.goto(`http://${serverAddr}/input`);
			await inputPage.waitForSelector('#input');
			await new Promise(r => setTimeout(r, 200));

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
