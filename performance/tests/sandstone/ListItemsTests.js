/* global CPUThrottling, page, minFPS, maxCLS, stepNumber, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */
/* eslint-disable*/

const TestResults = require('../../TestResults');
const {FPS, getAverageFPS} = require('../../TraceModel');
const {newPageMultiple, scrollAtPoint} = require('../../utils');

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
		let passContCLS = 0;
		let passContINP = 0;
		let passContFCP = 0;
		let passContLCP = 0;
		let avgCLS = 0;
		let avgINP = 0;
		let avgFCP = 0;
		let avgLCP = 0;
		for (let step = 0; step < stepNumber; step++) {
			const listItemsPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await listItemsPage.emulateCPUThrottling(CPUThrottling);
			await listItemsPage.goto(pageURL);
			await listItemsPage.addScriptTag({url: webVitalsURL});
			await new Promise(r => setTimeout(r, 100));
			await listItemsPage.waitForSelector(`#${componentName}`);
			await listItemsPage.focus(`#${componentName}`);
			await new Promise(r => setTimeout(r, 200));
			await listItemsPage.keyboard.down('ArrowDown');
			await listItemsPage.keyboard.up('ArrowDown');
			await new Promise(r => setTimeout(r, 200));
			await listItemsPage.keyboard.down('ArrowDown');
			await listItemsPage.keyboard.up('ArrowDown');
			await new Promise(r => setTimeout(r, 200));
			await listItemsPage.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 200));

			listItemsPage.on("console", (msg) => {
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

			await listItemsPage.evaluateHandle(() => {
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
			if (targetEnv === 'PC') await listItemsPage.close();
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

exports.listItemTests = listItemTests;

/* eslint-enable*/
