/* global CPUThrottling, page, maxCLS, stepNumber, maxFCP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {newPageMultiple} = require('../../utils');

describe('ThumbnailItem', () => {
	const component = 'ThumbnailItem';
	TestResults.newFile(component);

	it('should have a good CLS, FCP and LCP', async () => {
		let passContCLS = 0;
		let passContFCP = 0;
		let passContLCP = 0;
		let avgCLS = 0;
		let avgFCP = 0;
		let avgLCP = 0;
		for (let step = 0; step < stepNumber; step++) {
			const thumbnailItemPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await thumbnailItemPage.emulateCPUThrottling(CPUThrottling);
			await thumbnailItemPage.goto(`http://${serverAddr}/#/thumbnailItem`);
			await thumbnailItemPage.addScriptTag({url: webVitalsURL});
			await thumbnailItemPage.waitForSelector('#thumbnailItem');
			await thumbnailItemPage.focus('#thumbnailItem');
			await thumbnailItemPage.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 200));

			thumbnailItemPage.on("console", (msg) => {
				let jsonMsg = JSON.parse(msg.text());

				if (jsonMsg.name === 'CLS') {
					avgCLS = avgCLS + jsonMsg.value;
					if (jsonMsg.value < maxCLS) {
						passContCLS += 1;
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

			await thumbnailItemPage.evaluateHandle(() => {
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

			if (targetEnv === 'PC') await thumbnailItemPage.close();
		}

		avgCLS = avgCLS / stepNumber;
		avgFCP = avgFCP / stepNumber;
		avgLCP = avgLCP / stepNumber;

		TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((avgCLS + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'FCP', actualValue: Math.round((avgFCP + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'LCP', actualValue: Math.round((avgLCP + Number.EPSILON) * 1000) / 1000});

		expect(avgCLS).toBeLessThan(maxCLS);
		expect(avgFCP).toBeLessThan(maxFCP);
		expect(avgLCP).toBeLessThan(maxLCP);

		expect(passContCLS).toBeGreaterThan(passRatio * stepNumber);
		expect(passContFCP).toBeGreaterThan(passRatio * stepNumber);
		expect(passContLCP).toBeGreaterThan(passRatio * stepNumber);
	});
});
