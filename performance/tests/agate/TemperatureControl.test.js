/* global CPUThrottling, page, minFPS, maxCLS, stepNumber, maxDCL, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {getFileName, newPageMultiple} = require('../../utils');

describe('TemperatureControl', () => {
	const component = 'TemperatureControl';
	TestResults.newFile(component);

	describe('click', () => {
		it('animates', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/temperatureControl`);
			await page.waitForSelector('#agate-temperatureControl');
			await page.click('#agate-temperatureControl'); // to move mouse on the button.
			await page.mouse.down();
			await new Promise(r => setTimeout(r, 100));
			await page.mouse.up();
			await page.mouse.down();
			await new Promise(r => setTimeout(r, 100));
			await page.mouse.up();
			await page.mouse.down();
			await new Promise(r => setTimeout(r, 100));
			await page.mouse.up();
			await page.mouse.down();
			await new Promise(r => setTimeout(r, 100));
			await page.mouse.up();

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Click', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	describe('keypress', () => {
		it('animates', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/temperatureControl`);
			await page.waitForSelector('#agate-temperatureControl');
			await page.focus('#agate-temperatureControl');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowUp');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.up('ArrowUp');
			await page.keyboard.down('ArrowUp');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.up('ArrowUp');
			await page.keyboard.down('ArrowDown');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.up('ArrowDown');
			await page.keyboard.down('ArrowDown');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.up('ArrowDown');

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Keypress', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	it('should have a good CLS and INP', async () => {
		await page.goto(`http://${serverAddr}/temperatureControl`);
		await page.addScriptTag({url: webVitalsURL});
		await page.waitForSelector('#agate-temperatureControl');
		await page.focus('#agate-temperatureControl');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.down('ArrowUp');
		await page.keyboard.up('ArrowUp');
		await new Promise(r => setTimeout(r, 200));

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
			const buttonPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await buttonPage.emulateCPUThrottling(CPUThrottling);

			await buttonPage.tracing.start({path: filename, screenshots: false});
			await buttonPage.goto(`http://${serverAddr}/temperatureControl`);
			await buttonPage.waitForSelector('#agate-temperatureControl');
			await new Promise(r => setTimeout(r, 200));

			await buttonPage.tracing.stop();

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

			if (targetEnv === 'PC') await buttonPage.close();
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

