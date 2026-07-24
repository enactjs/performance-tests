/* global CPUThrottling, page, minFPS, maxCLS, stepNumber, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsPath */

const TestResults = require('../../TestResults');
const {FPS, getAverageFPS} = require('../../TraceModel');
const {collectWebVitals, newPageMultiple} = require('../../utils');

describe('TemperatureControl', () => {
	const component = 'TemperatureControl';
	TestResults.newFile(component);

	describe('click', () => {
		it('animates', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/#/temperatureControl`);
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
			await page.goto(`http://${serverAddr}/#/temperatureControl`);
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
			const temperatureControlPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await temperatureControlPage.emulateCPUThrottling(CPUThrottling);
			await temperatureControlPage.goto(`http://${serverAddr}/#/temperatureControl`);
			await temperatureControlPage.addScriptTag({path: webVitalsPath});
			await new Promise(r => setTimeout(r, 100));

			const stepVitals = collectWebVitals(temperatureControlPage);

			await temperatureControlPage.evaluateHandle(() => {
				webVitals.onINP(function (inp) {
					console.log(JSON.stringify({"name": inp.name, "value": inp.value})); // eslint-disable-line no-console
				},
				{
					reportAllChanges: true,
					durationThreshold: 0
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

			await temperatureControlPage.waitForSelector('#agate-temperatureControl');
			await temperatureControlPage.focus('#agate-temperatureControl');
			await new Promise(r => setTimeout(r, 200));
			await temperatureControlPage.keyboard.down('ArrowUp');
			await temperatureControlPage.keyboard.up('ArrowUp');
			await new Promise(r => setTimeout(r, 200));
			await new Promise(r => setTimeout(r, 1000));

			avgCLS = avgCLS + (stepVitals.CLS || 0);
			avgINP = avgINP + (stepVitals.INP || 0);
			avgFCP = avgFCP + (stepVitals.FCP || 0);
			avgLCP = avgLCP + (stepVitals.LCP || 0);

			if (stepVitals.CLS < maxCLS) passContCLS += 1;
			if (stepVitals.INP < maxINP) passContINP += 1;
			if (stepVitals.FCP < maxFCP) passContFCP += 1;
			if (stepVitals.LCP < maxLCP) passContLCP += 1;

			if (targetEnv === 'PC') await temperatureControlPage.close();
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

