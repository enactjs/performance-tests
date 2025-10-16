/* global CPUThrottling, page, minFPS, maxCLS, stepNumber, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {FPS, getAverageFPS} = require('../../TraceModel');
const {isValidJSON, newPageMultiple} = require('../../utils');

const component = 'Marquee';

describe('Marquee', () => {
	TestResults.newFile(component);

	it('FPS on hover', async () => {
		await FPS();
		await page.goto(`http://${serverAddr}/#/marquee`);
		await page.waitForSelector('#marquee');
		await page.hover('#marquee');
		await new Promise(r => setTimeout(r, 500));

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
			const marqueePage = targetEnv === 'TV' ? page : await newPageMultiple();
			await marqueePage.emulateCPUThrottling(CPUThrottling);
			await marqueePage.goto(`http://${serverAddr}/#/marquee`);
			await marqueePage.addScriptTag({url: webVitalsURL});
			await new Promise(r => setTimeout(r, 100));
			await marqueePage.waitForSelector('#marquee');
			await new Promise(r => setTimeout(r, 200));
			await marqueePage.click('#marquee');
			await new Promise(r => setTimeout(r, 200));

			marqueePage.on("console", (msg) => {
				let jsonMsg = {};

				if (isValidJSON(msg.text())) {
					jsonMsg = JSON.parse(msg.text());
				}

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

			await marqueePage.evaluateHandle(() => {
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
			if (targetEnv === 'PC') await marqueePage.close();
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

	describe('Multiple Marquees', () => {
		const counts = [10, 40, 70, 100];

		for (let index = 0; index < counts.length; index++) {
			const count = counts[index];
			it(`updates marqueeOn hover ${count} Marquee components`, async () => {
				await FPS();

				await page.goto(`http://${serverAddr}/#/marqueeMultiple?count=${count}`);
				await page.waitForSelector('#Container');
				await new Promise(r => setTimeout(r, 200));

				await page.hover('#Marquee_5');
				await new Promise(r => setTimeout(r, 2000));

				const averageFPS = await getAverageFPS();
				TestResults.addResult({component: component, type: `${count} Marquee Multiple Hover Frames Per Second`, actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});
			});
		}

		for (let index = 0; index < counts.length; index++) {
			const count = counts[index];
			it(`updates marqueeOn render ${count} Marquee components`, async () => {
				await FPS();

				await page.goto(`http://${serverAddr}/#/marqueeMultiple?count=${count}&marqueeOn=render`);
				await page.waitForSelector('#Container');
				await new Promise(r => setTimeout(r, 2000));

				const averageFPS = await getAverageFPS();
				TestResults.addResult({component: component, type: `${count} Marquee Multiple Render Frames Per Second`, actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});
			});
		}
	});
});

