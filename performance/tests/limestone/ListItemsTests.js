/* global page, minFPS, maxCLS, stepNumber, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */
/* eslint-disable*/

const TestResults = require('../../TestResults');
const {CLS, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, getFileName, newPageMultiple, scrollAtPoint} = require('../../utils');

const listItemTests = (componentName, dataSize) => describe(componentName, () => {
	jest.setTimeout(100000);

	const component = componentName + (dataSize ? dataSize : '');
	TestResults.newFile(component);
	const pageURL = dataSize ? `http://${serverAddr}/#/${componentName}?dataSize=${dataSize}` : `http://${serverAddr}/#/${componentName}`;

	describe('ScrollButton', () => {
		it('scrolls down with native scrollMode', async () => {
			const pageURLNative = dataSize ? pageURL + '&scrollMode=native' : pageURL + '?scrollMode=native';

			await FPS();
			await page.goto(pageURLNative);
			await page.waitForSelector(`#${componentName}`);
			await page.focus('[aria-label="scroll up or down with up down button"]');
			await page.keyboard.down('ArrowDown');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.down('ArrowDown');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.down('ArrowDown');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.down('ArrowDown');
			await new Promise(r => setTimeout(r, 2000));

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Keypress', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});

		it('scrolls down with translate scrollMode', async () => {
			const pageURLTranslate = dataSize ? pageURL + '&scrollMode=translate' : pageURL + '?scrollMode=translate';

			await FPS();
			await page.goto(pageURLTranslate);
			await page.waitForSelector(`#${componentName}`);
			await page.focus('[aria-label="scroll up or down with up down button"]');
			await page.keyboard.down('ArrowDown');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.down('ArrowDown');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.down('ArrowDown');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.down('ArrowDown');
			await new Promise(r => setTimeout(r, 2000));

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Keypress Translate', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	describe('mousewheel', () => {
		it('scrolls down with native scrollMode', async () => {
			const pageURLNative = dataSize ? pageURL + '&scrollMode=native' : pageURL + '?scrollMode=native';

			await FPS();
			const List = `#${componentName}`;

			await page.goto(pageURLNative);
			await page.waitForSelector(List);
			await scrollAtPoint(page, List, 1000);
			await new Promise(r => setTimeout(r, 200));
			await scrollAtPoint(page, List, 1000);
			await new Promise(r => setTimeout(r, 200));
			await scrollAtPoint(page, List, 1000);
			await new Promise(r => setTimeout(r, 200));
			await scrollAtPoint(page, List, 1000);
			await new Promise(r => setTimeout(r, 200));

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Mousewheel', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});

		it('scrolls down with translate scrollMode', async () => {
			const pageURLTranslate = dataSize ? pageURL + '&scrollMode=translate' : pageURL + '?scrollMode=translate';

			await FPS();
			const List = `#${componentName}`;

			await page.goto(pageURLTranslate);
			await page.waitForSelector(List);
			await scrollAtPoint(page, List, 1000);
			await new Promise(r => setTimeout(r, 200));
			await scrollAtPoint(page, List, 1000);
			await new Promise(r => setTimeout(r, 200));
			await scrollAtPoint(page, List, 1000);
			await new Promise(r => setTimeout(r, 200));
			await scrollAtPoint(page, List, 1000);
			await new Promise(r => setTimeout(r, 200));

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Mousewheel Translate', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	it('should have a good CLS, FCP, INP and LCP', async () => {
		await page.goto(pageURL);
		await page.addScriptTag({url: webVitalsURL});
		await page.waitForSelector(`#${componentName}`);
		await page.focus(`#${componentName}`);
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.down('Enter');
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

exports.listItemTests = listItemTests;

/* eslint-enable*/
