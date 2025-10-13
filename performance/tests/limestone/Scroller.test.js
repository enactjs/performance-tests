/* global page, minFPS, maxCLS, stepNumber, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {CLS, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, getFileName, newPageMultiple, scrollAtPoint} = require('../../utils');

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
		await page.goto(`http://${serverAddr}/#/scroller`);
		await page.addScriptTag({url: webVitalsURL});
		await page.waitForSelector('#scroller');
		await page.focus('[aria-label="scroll up or down with up down button"]');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.down('Enter');
		await page.keyboard.up('Enter');
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
