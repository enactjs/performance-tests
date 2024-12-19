/* global CPUThrottling, page, minFPS, maxCLS, stepNumber, maxDCL, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {getFileName, newPageMultiple} = require('../../utils');

describe('Popup', () => {
	const component = 'Popup';
	const open = '#button-open';
	const close = '#button-close';
	TestResults.newFile(component);

	it('FPS', async () => {
		await FPS();
		await page.goto(`http://${serverAddr}/popup`);
		await page.waitForSelector('#popup');
		await page.click(close);
		await new Promise(r => setTimeout(r, 500));
		await page.click(open);
		await new Promise(r => setTimeout(r, 500));
		await page.click(close);
		await new Promise(r => setTimeout(r, 500));
		await page.click(open);
		await new Promise(r => setTimeout(r, 500));
		await page.click(close);
		await new Promise(r => setTimeout(r, 500));
		await page.click(open);
		await new Promise(r => setTimeout(r, 500));
		await page.click(close);
		await new Promise(r => setTimeout(r, 500));

		const averageFPS = await getAverageFPS();
		TestResults.addResult({component: component, type: 'FPS', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

		expect(averageFPS).toBeGreaterThan(minFPS);
	});

	it('should have a good CLS and INP', async () => {
		await page.goto(`http://${serverAddr}/popup`);
		await page.addScriptTag({url: webVitalsURL});
		await page.waitForSelector('#popup');
		await page.click(close);
		await new Promise(r => setTimeout(r, 500));
		await page.click(open);
		await new Promise(r => setTimeout(r, 500));
		await page.click(close);
		await new Promise(r => setTimeout(r, 500));
		await page.click(open);
		await new Promise(r => setTimeout(r, 500));
		await page.click(close);
		await new Promise(r => setTimeout(r, 500));
		await page.click(open);
		await new Promise(r => setTimeout(r, 500));
		await page.click(close);
		await new Promise(r => setTimeout(r, 500));

		let maxValue;

		page.on("console", (msg) => {
			let jsonMsg = JSON.parse(msg.text());
			if (jsonMsg.name === 'CLS') {
				maxValue = maxCLS;
			} else if (jsonMsg.name === 'INP') {
				maxValue = maxINP;
			}

			TestResults.addResult({component: component, type: jsonMsg.name, actualValue: Math.round((Number(jsonMsg.value) + Number.EPSILON) * 1000) / 1000});
			expect(Number(jsonMsg.value)).toBeLessThan(maxValue);
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
			const popupPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await popupPage.emulateCPUThrottling(CPUThrottling);

			await popupPage.tracing.start({path: filename, screenshots: false});
			await popupPage.goto(`http://${serverAddr}/popup`);
			await popupPage.waitForSelector('#popup');
			await new Promise(r => setTimeout(r, 200));

			await popupPage.tracing.stop();

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

			if (targetEnv === 'PC') await popupPage.close();
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

