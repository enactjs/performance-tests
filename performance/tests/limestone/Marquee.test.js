/* global page, minFPS, maxCLS, stepNumber, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {CLS, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, getFileName, newPageMultiple} = require('../../utils');

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
		await page.goto(`http://${serverAddr}/#/marquee`);
		await page.addScriptTag({url: webVitalsURL});
		await page.waitForSelector('#marquee');
		await new Promise(r => setTimeout(r, 200));
		await page.click('#marquee');
		await new Promise(r => setTimeout(r, 200));

		page.on("console", (msg) => {
			let jsonMsg = JSON.parse(msg.text());
			TestResults.addResult({component: component, type: jsonMsg.name, actualValue: Math.round((Number(jsonMsg.value) + Number.EPSILON) * 1000) / 1000});

			if (jsonMsg.name === 'CLS') {
				expect(Number(jsonMsg.value)).toBeLessThan(maxCLS);
			} else if (jsonMsg.name === 'INP') {
				expect(Number(jsonMsg.value)).toBeLessThan(maxINP);
			} else if (jsonMsg.name === 'FCP') {
				expect(Number(jsonMsg.value)).toBeLessThan(maxFCP);
			} else if (jsonMsg.name === 'LCP') {
				expect(Number(jsonMsg.value)).toBeLessThan(maxLCP);
			}
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

