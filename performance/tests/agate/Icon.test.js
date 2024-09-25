/* global CPUThrottling, page, maxCLS, stepNumber, maxDCL, maxFCP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {PageLoadingMetrics} = require('../../TraceModel');
const {getFileName, newPageMultiple} = require('../../utils');

describe('Icon', () => {
	const component = 'Icon';
	TestResults.newFile(component);

	it('should have a good CLS', async () => {
		await page.goto(`http://${serverAddr}/icon`);
		await page.addScriptTag({url: webVitalsURL});
		await page.waitForSelector('#icon');
		await page.focus('#icon');
		await page.keyboard.down('Enter');
		await new Promise(r => setTimeout(r, 200));

		let clsValue;

		page.on("console", (msg) => {
			let jsonMsg = JSON.parse(msg.text());

			clsValue = Number(jsonMsg.value);
			TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((clsValue + Number.EPSILON) * 1000) / 1000});
			expect(clsValue).toBeLessThan(maxCLS);
		});

		await page.evaluateHandle(() => {
			webVitals.onCLS(function (cls) {
					console.log(JSON.stringify({"name": cls.name, "value": cls.value})); // eslint-disable-line no-console
				},
				{
					reportAllChanges: true
				}
			);
		});
		await new Promise(r => setTimeout(r, 1000));
	});

	it('should have a good DCL, FCP and LCP', async () => {
		const filename = getFileName(component);

		let passContDCL = 0;
		let passContFCP = 0;
		let passContLCP = 0;
		let avgDCL = 0;
		let avgFCP = 0;
		let avgLCP = 0;
		for (let step = 0; step < stepNumber; step++) {
			const iconPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await iconPage.emulateCPUThrottling(CPUThrottling);

			await iconPage.tracing.start({path: filename, screenshots: false});
			await iconPage.goto(`http://${serverAddr}/icon`);
			await iconPage.waitForSelector('#icon');
			await new Promise(r => setTimeout(r, 200));

			await iconPage.tracing.stop();

			const {actualDCL, actualFCP, actualLCP} = PageLoadingMetrics(filename);
			avgDCL = avgDCL + actualDCL;
			if (actualDCL < maxDCL) {
				passContDCL += 1;
			}

			avgFCP = avgFCP + actualFCP;
			if (actualFCP < maxFCP) {
				passContFCP += 1;
			}

			avgLCP = avgLCP + actualLCP;
			if (actualLCP < maxLCP) {
				passContLCP += 1;
			}

			if (targetEnv === 'PC') await iconPage.close();
		}
		avgDCL = avgDCL / stepNumber;
		avgFCP = avgFCP / stepNumber;
		avgLCP = avgLCP / stepNumber;

		TestResults.addResult({component: component, type: 'DCL', actualValue: Math.round((avgDCL + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'FCP', actualValue: Math.round((avgFCP + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'LCP', actualValue: Math.round((avgLCP + Number.EPSILON) * 1000) / 1000});

		expect(passContDCL).toBeGreaterThan(passRatio * stepNumber);
		expect(avgDCL).toBeLessThan(maxDCL);

		expect(passContFCP).toBeGreaterThan(passRatio * stepNumber);
		expect(avgFCP).toBeLessThan(maxFCP);

		expect(passContLCP).toBeGreaterThan(passRatio * stepNumber);
		expect(avgLCP).toBeLessThan(maxLCP);
	});
});
