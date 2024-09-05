/* global CPUThrottling, page, minFPS, maxCLS, stepNumber, maxDCL, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */

const TestResults = require('../../TestResults');
const {CLS, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, getFileName, newPageMultiple} = require('../../utils');

const component = 'Marquee';

describe('Marquee', () => {
	TestResults.newFile(component);

	it('FPS on hover', async () => {
		await FPS();
		await page.goto(`http://${serverAddr}/marquee`);
		await page.waitForSelector('#marquee');
		await page.hover('#marquee');
		await new Promise(r => setTimeout(r, 500));

		const averageFPS = await getAverageFPS();
		TestResults.addResult({component: component, type: 'FPS', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

		expect(averageFPS).toBeGreaterThan(minFPS);
	});

	it('should have a good CLS', async () => {
		await page.evaluateOnNewDocument(CLS);
		await page.goto(`http://${serverAddr}/marquee`);
		await page.waitForSelector('#marquee');
		await page.hover('#marquee');
		await new Promise(r => setTimeout(r, 500));

		let actualCLS = await clsValue();

		TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

		expect(actualCLS).toBeLessThan(maxCLS);
	});

	it('should have a good INP', async () => {
		await page.goto(`http://${serverAddr}/marquee`);
		await page.addScriptTag({url: webVitalsURL});
		await page.waitForSelector('#marquee');
		await new Promise(r => setTimeout(r, 200));
		await page.click('#marquee');
		await new Promise(r => setTimeout(r, 200));

		let inpValue;

		page.on("console", (msg) => {
			inpValue = Number(msg.text());
			TestResults.addResult({component: component, type: 'INP', actualValue: Math.round((inpValue + Number.EPSILON) * 1000) / 1000});
			expect(inpValue).toBeLessThan(maxINP);
		});

		await page.evaluateHandle(() => {
			webVitals.onINP(function (inp) {
				console.log(inp.value); // eslint-disable-line no-console
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
			const marqueePage = targetEnv === 'TV' ? page : await newPageMultiple();
			await marqueePage.emulateCPUThrottling(CPUThrottling);

			await marqueePage.tracing.start({path: filename, screenshots: false});
			await marqueePage.goto(`http://${serverAddr}/marquee`);
			await marqueePage.waitForSelector('#marquee');
			await new Promise(r => setTimeout(r, 200));

			await marqueePage.tracing.stop();

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

			if (targetEnv === 'PC') await marqueePage.close();
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

	describe('Multiple Marquees', () => {
		const counts = [10, 40, 70, 100];

		for (let index = 0; index < counts.length; index++) {
			const count = counts[index];
			it(`updates marqueeOn hover ${count} Marquee components`, async () => {
				await FPS();

				await page.goto(`http://${serverAddr}/marqueeMultiple?count=${count}`);
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

				await page.goto(`http://${serverAddr}/marqueeMultiple?count=${count}&marqueeOn=render`);
				await page.waitForSelector('#Container');
				await new Promise(r => setTimeout(r, 2000));

				const averageFPS = await getAverageFPS();
				TestResults.addResult({component: component, type: `${count} Marquee Multiple Render Frames Per Second`, actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});
			});
		}
	});
});

