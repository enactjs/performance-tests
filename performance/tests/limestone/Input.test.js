/* global page, minFPS, maxCLS, stepNumber, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {CLS, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, getFileName, newPageMultiple} = require('../../utils');

describe('Input', () => {
	const component = 'Input';
	TestResults.newFile(component);

	it('FPS', async () => {
		await FPS();
		await page.goto(`http://${serverAddr}/#/input`);
		await page.waitForSelector('.inputView');
		await page.focus('.inputView');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.down('Enter');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.up('Enter');
		await page.keyboard.down('A');
		await page.keyboard.up('A');
		await page.keyboard.down('B');
		await page.keyboard.up('B');
		await page.keyboard.down('B');
		await page.keyboard.up('B');
		await page.keyboard.down('A');
		await page.keyboard.up('A');
		await page.keyboard.down('Backspace');
		await page.keyboard.up('Backspace');
		await page.keyboard.down('Backspace');
		await page.keyboard.up('Backspace');
		await page.keyboard.down('Enter');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.up('Enter');
		await page.keyboard.down('A');
		await page.keyboard.up('A');
		await page.keyboard.down('B');
		await page.keyboard.up('B');
		await page.keyboard.down('B');
		await page.keyboard.up('B');
		await page.keyboard.down('A');
		await page.keyboard.up('A');
		await page.keyboard.down('Backspace');
		await page.keyboard.up('Backspace');
		await page.keyboard.down('Backspace');
		await page.keyboard.up('Backspace');
		await page.keyboard.down('Enter');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.up('Enter');
		await page.keyboard.down('A');
		await page.keyboard.up('A');
		await page.keyboard.down('B');
		await page.keyboard.up('B');
		await page.keyboard.down('B');
		await page.keyboard.up('B');
		await page.keyboard.down('A');
		await page.keyboard.up('A');
		await page.keyboard.down('Backspace');
		await page.keyboard.up('Backspace');
		await page.keyboard.down('Backspace');
		await page.keyboard.up('Backspace');
		await page.keyboard.down('Enter');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.up('Enter');

		const averageFPS = await getAverageFPS();
		TestResults.addResult({component: component, type: 'FPS', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

		expect(averageFPS).toBeGreaterThan(minFPS);
	});

	it('should have a good CLS, FCP, INP and LCP', async () => {
		await page.goto(`http://${serverAddr}/#/input`);
		await page.addScriptTag({url: webVitalsURL});
		await page.waitForSelector('.inputView');
		await new Promise(r => setTimeout(r, 100));
		await page.click('.inputView');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('A');
		await page.keyboard.up('A');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('B');
		await page.keyboard.up('B');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('B');
		await page.keyboard.up('B');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('A');
		await page.keyboard.up('A');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('Backspace');
		await page.keyboard.up('Backspace');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('Backspace');
		await page.keyboard.up('Backspace');
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
});
