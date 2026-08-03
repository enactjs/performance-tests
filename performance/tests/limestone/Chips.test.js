/* global CPUThrottling, page, maxCLS, stepNumber, maxFCP, maxINP, maxLCP, minFPS, passRatio, serverAddr, targetEnv, webVitals, webVitalsPath */

const TestResults = require('../../TestResults');
const {FPS, getAverageFPS} = require('../../TraceModel');
const {collectWebVitals, newPageMultiple} = require('../../utils');

describe('Chips', () => {
	const component = 'Chips';
	TestResults.newFile(component);

	describe('click', () => {
		it('animates', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/#/chips`);
			await page.waitForSelector('#chips');
			await page.click('#chips'); // to move mouse on the chips.
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
			await page.goto(`http://${serverAddr}/#/chips`);
			await page.waitForSelector('#chips');
			await page.focus('#chips');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.down('ArrowRight');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.up('ArrowRight');
			await page.keyboard.down('ArrowRight');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.up('ArrowRight');
			await page.keyboard.down('ArrowRight');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.up('ArrowRight');
			await page.keyboard.down('ArrowRight');
			await new Promise(r => setTimeout(r, 100));
			await page.keyboard.up('ArrowRight');

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
			const chipsPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await chipsPage.emulateCPUThrottling(CPUThrottling);
			await chipsPage.goto(`http://${serverAddr}/#/chips`);
			await chipsPage.addScriptTag({path: webVitalsPath});
			await new Promise(r => setTimeout(r, 100));

			const stepVitals = collectWebVitals(chipsPage);

			await chipsPage.evaluateHandle(() => {
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

			await chipsPage.waitForSelector('#chips');
			await chipsPage.focus('#chips');
			await new Promise(r => setTimeout(r, 300));
			// Activate/select the chips several times so a qualifying interaction lands
			// each step even before Spotlight/focus has settled on the first pages.
			await chipsPage.keyboard.press('ArrowRight');
			for (let i = 0; i < 6; i++) {
				await chipsPage.keyboard.press('ArrowRight');
				await new Promise(r => setTimeout(r, 80));
			}
			await new Promise(r => setTimeout(r, 1000));

			avgCLS = avgCLS + (stepVitals.CLS || 0);
			avgINP = avgINP + (stepVitals.INP || 0);
			avgFCP = avgFCP + (stepVitals.FCP || 0);
			avgLCP = avgLCP + (stepVitals.LCP || 0);

			if (stepVitals.CLS < maxCLS) passContCLS += 1;
			if (stepVitals.INP < maxINP) passContINP += 1;
			if (stepVitals.FCP < maxFCP) passContFCP += 1;
			if (stepVitals.LCP < maxLCP) passContLCP += 1;

			if (targetEnv === 'PC') await chipsPage.close();
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
