/* global CPUThrottling, page, minFPS, maxCLS, stepNumber, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {FPS, getAverageFPS} = require('../../TraceModel');
const {newPageMultiple} = require('../../utils');

describe('ContextualPopupDecorator', () => {
	const component = 'ContextualPopupDecorator';
	TestResults.newFile(component);

	it('FPS', async () => {
		await FPS();
		await page.goto(`http://${serverAddr}/#/contextualPopupDecorator`);
		await page.waitForSelector('#agate-contextualPopupDecorator');
		await page.click('#agate-contextualPopupDecorator');
		await new Promise(r => setTimeout(r, 100));
		await page.click('#agate-contextualPopupDecorator');
		await new Promise(r => setTimeout(r, 100));
		await page.click('#agate-contextualPopupDecorator');
		await new Promise(r => setTimeout(r, 100));
		await page.click('#agate-contextualPopupDecorator');
		await new Promise(r => setTimeout(r, 100));

		const averageFPS = await getAverageFPS();
		TestResults.addResult({component: component, type: 'FPS', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

		expect(averageFPS).toBeGreaterThan(minFPS);
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
			const contextualPopupDecoratorPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await contextualPopupDecoratorPage.emulateCPUThrottling(CPUThrottling);
			await contextualPopupDecoratorPage.goto(`http://${serverAddr}/#/contextualPopupDecorator`);
			await contextualPopupDecoratorPage.addScriptTag({url: webVitalsURL});
			await contextualPopupDecoratorPage.waitForSelector('#agate-contextualPopupDecorator');
			await new Promise(r => setTimeout(r, 100));
			await contextualPopupDecoratorPage.click('#agate-contextualPopupDecorator');
			await new Promise(r => setTimeout(r, 100));

			contextualPopupDecoratorPage.on("console", (msg) => {
				let jsonMsg = JSON.parse(msg.text());

				if (jsonMsg.name === 'CLS') {
					avgCLS = avgCLS + jsonMsg.value;
					if (jsonMsg.value < maxCLS) {
						passContCLS += 1;
					}
				} else if (jsonMsg.name === 'INP') {
					avgINP = avgINP + jsonMsg.value;
					if (jsonMsg.value < maxINP) {
						passContINP += 1;
					}
				} else if (jsonMsg.name === 'FCP') {
					avgFCP = avgFCP + jsonMsg.value;
					if (jsonMsg.value < maxFCP) {
						passContFCP += 1;
					}
				} else if (jsonMsg.name === 'LCP') {
					avgLCP = avgLCP + jsonMsg.value;
					if (jsonMsg.value < maxLCP) {
						passContLCP += 1;
					}
				}
			});

			await contextualPopupDecoratorPage.evaluateHandle(() => {
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
			await new Promise(r => setTimeout(r, 1000));

			if (targetEnv === 'PC') await contextualPopupDecoratorPage.close();
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
