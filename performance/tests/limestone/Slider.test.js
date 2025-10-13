/* global page, minFPS, maxCLS, stepNumber, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const {CLS, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, getFileName, newPageMultiple} = require('../../utils');
const TestResults = require('../../TestResults');

describe('Slider', () => {
	const component = 'Slider';
	TestResults.newFile(component);

	describe('drag', () => {
		it('increment', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/#/slider`);
			await page.waitForSelector('#slider');
			const {x: posX, y: posY} = await page.evaluate(() => {
				const knobElement = document.querySelector('[role="progressbar"]');
				const {x, y} = knobElement.getBoundingClientRect();
				return {x, y};
			});

			await page.mouse.move(posX, posY);
			await page.mouse.down();

			for (let i = 0; i < 100; i++) {
				await page.mouse.move(posX + (i * 10), posY);
			}

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Click', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	describe('keyboard', () => {
		it('increment', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/#/slider`);
			await page.waitForSelector('#slider');
			await page.focus('#slider');

			await page.keyboard.press('Enter');

			for (let i = 0; i < 100; i++) {
				await page.keyboard.down('ArrowRight');
			}

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Keypress', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	it('should have a good CLS, FCP, INP and LCP', async () => {
		await page.goto(`http://${serverAddr}/#/slider`);
		await page.addScriptTag({url: webVitalsURL});
		await page.waitForSelector('#slider');
		await page.focus('#slider');
		await new Promise(r => setTimeout(r, 300));
		await page.keyboard.down('ArrowRight');
		await page.keyboard.up('ArrowRight');
		await new Promise(r => setTimeout(r, 300));
		await page.keyboard.down('ArrowRight');
		await page.keyboard.up('ArrowRight');
		await new Promise(r => setTimeout(r, 300));

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
});

