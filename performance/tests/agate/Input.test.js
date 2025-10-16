/* global CPUThrottling, page, minFPS, maxCLS, stepNumber, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {FPS, getAverageFPS} = require('../../TraceModel');
const {isValidJSON, newPageMultiple} = require('../../utils');

describe('Input', () => {
	const component = 'Input';
	TestResults.newFile(component);

	it('FPS', async () => {
		await FPS();
		await page.goto(`http://${serverAddr}/#/input`);
		await page.waitForSelector('#input');
		await page.focus('#input');
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
		let passContCLS = 0;
		let passContINP = 0;
		let passContFCP = 0;
		let passContLCP = 0;
		let avgCLS = 0;
		let avgINP = 0;
		let avgFCP = 0;
		let avgLCP = 0;
		for (let step = 0; step < stepNumber; step++) {
			const alertPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await alertPage.emulateCPUThrottling(CPUThrottling);
			await alertPage.goto(`http://${serverAddr}/#/input`);
			await alertPage.addScriptTag({url: webVitalsURL});
			await new Promise(r => setTimeout(r, 100));
			await alertPage.waitForSelector('#input');
			await new Promise(r => setTimeout(r, 100));
			await alertPage.click('#input');
			await new Promise(r => setTimeout(r, 100));
			await alertPage.keyboard.down('A');
			await alertPage.keyboard.up('A');
			await new Promise(r => setTimeout(r, 100));
			await alertPage.keyboard.down('B');
			await alertPage.keyboard.up('B');
			await new Promise(r => setTimeout(r, 100));
			await alertPage.keyboard.down('B');
			await alertPage.keyboard.up('B');
			await new Promise(r => setTimeout(r, 100));
			await alertPage.keyboard.down('A');
			await alertPage.keyboard.up('A');
			await new Promise(r => setTimeout(r, 100));
			await alertPage.keyboard.down('Backspace');
			await alertPage.keyboard.up('Backspace');
			await new Promise(r => setTimeout(r, 100));
			await alertPage.keyboard.down('Backspace');
			await alertPage.keyboard.up('Backspace');
			await new Promise(r => setTimeout(r, 100));

			alertPage.on("console", (msg) => {
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

			await alertPage.evaluateHandle(() => {
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

			if (targetEnv === 'PC') await alertPage.close();
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
