/* global CPUThrottling, page, minFPS, maxCLS, stepNumber, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {FPS, getAverageFPS} = require('../../TraceModel');
const {isValidJSON, newPageMultiple, scrollAtPoint} = require('../../utils');

describe( 'Scroller', () => {
	const component = 'Scroller';
	TestResults.newFile(component);

	describe('keypress', () => {
		it('scrolls down', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/#/scroller`);
			await page.focus('[aria-label="scroll up or down with up down button"]');
			await page.keyboard.down('Enter');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 2000));

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Click', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	describe('mouse wheel', () => {
		it('scrolls down', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/#/scroller`);
			const scroller = '#scroller';

			await scrollAtPoint(page, scroller, 1000);
			await new Promise(r => setTimeout(r, 200));
			await scrollAtPoint(page, scroller, 1000);
			await new Promise(r => setTimeout(r, 200));
			await scrollAtPoint(page, scroller, 1000);
			await new Promise(r => setTimeout(r, 200));
			await scrollAtPoint(page, scroller, 1000);
			await new Promise(r => setTimeout(r, 200));

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
			const scrollerPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await scrollerPage.emulateCPUThrottling(CPUThrottling);
			await scrollerPage.goto(`http://${serverAddr}/#/scroller`);
			await scrollerPage.addScriptTag({url: webVitalsURL});
			await new Promise(r => setTimeout(r, 100));
			await scrollerPage.waitForSelector('#scroller');
			await scrollerPage.focus('[aria-label="scroll up or down with up down button"]');
			await new Promise(r => setTimeout(r, 200));
			await scrollerPage.keyboard.down('Enter');
			await scrollerPage.keyboard.up('Enter');
			await new Promise(r => setTimeout(r, 200));

			scrollerPage.on("console", (msg) => {
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

			await scrollerPage.evaluateHandle(() => {
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
			if (targetEnv === 'PC') await scrollerPage.close();
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

	it('scroll down with 5-way with Scroller Native', async () => {
		await FPS();

		await page.goto(`http://${serverAddr}/#/scrollerMultipleChildren?count=100&type=ScrollerNative`);
		await page.waitForSelector('#Scroller');
		await page.focus('#Scroller > div:first-child > div:first-child');

		for (let i = 0; i < 300; i++) {
			await page.keyboard.down('ArrowDown');
			await new Promise(r => setTimeout(r, 10));
		}

		await new Promise(r => setTimeout(r, 1000));

		const averageFPS = await getAverageFPS();
		TestResults.addResult({component: component, type: 'Scroller Native Frames Per Second', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});
	});
});
