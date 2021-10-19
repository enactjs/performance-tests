const TestResults = require('../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../TraceModel');
const {clsValue, firstInputValue, getFileName} = require('../utils');

const component = 'Marquee';
const MarqueeText = '[class$="Marquee_marquee"]';

describe('Marquee', () => {
	it('FPS on hover', async () => {
		await FPS();
		await page.goto('http://localhost:8080/marquee');
		await page.waitForSelector('#marquee');
		await page.hover(MarqueeText);
		await page.waitForTimeout(500);

		const averageFPS = await getAverageFPS();
		TestResults.addResult({component: component, type: 'Frames Per Second', actualValue: averageFPS});

		expect(averageFPS).toBeGreaterThan(minFPS);
	});

	it('should have a good FID and CLS', async () => {
		await page.evaluateOnNewDocument(FID);
		await page.evaluateOnNewDocument(CLS);
		await page.goto('http://localhost:8080/marquee');
		await page.waitForSelector('#marquee');
		await page.hover(MarqueeText);
		await page.waitForTimeout(500);

		let actualFirstInput = await firstInputValue();
		let actualCLS = await clsValue();

		TestResults.addResult({component: component, type: 'First Input Delay', actualValue: actualFirstInput});
		TestResults.addResult({component: component, type: 'CLS', actualValue: actualCLS});

		expect(actualFirstInput).toBeLessThan(maxFID);
		expect(actualCLS).toBeLessThan(maxCLS);
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
			const page = await testMultiple.newPage();

			await page.tracing.start({path: filename, screenshots: false});
			await page.goto('http://localhost:8080/marquee');
			await page.waitForSelector('#marquee');
			await page.waitForTimeout(200);

			await page.tracing.stop();

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

			await page.close();
		}
		avgDCL = avgDCL / stepNumber;
		avgFCP = avgFCP / stepNumber;
		avgLCP = avgLCP / stepNumber;

		TestResults.addResult({component: component, type: 'average DCL', actualValue: avgDCL});
		TestResults.addResult({component: component, type: 'average FCP', actualValue: avgFCP});
		TestResults.addResult({component: component, type: 'average LCP', actualValue: avgLCP});

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

				await page.goto(`http://localhost:8080/marqueeMultiple?count=${count}`);
				await page.waitForSelector('#Container');
				await page.waitForTimeout(200);

				await page.hover('#Marquee_5');
				await page.waitForTimeout(2000);

				const averageFPS = await getAverageFPS();
				TestResults.addResult({component: component, type: 'Marquee Multiple Hover Frames Per Second', actualValue: averageFPS});
			});
		}

		for (let index = 0; index < counts.length; index++) {
			const count = counts[index];
			it(`updates marqueeOn render ${count} Marquee components`, async () => {
				await FPS();

				await page.goto(`http://localhost:8080/marqueeMultiple?count=${count}&marqueeOn=render`);
				await page.waitForSelector('#Container');
				await page.waitForTimeout(2000);

				const averageFPS = await getAverageFPS();
				TestResults.addResult({component: component, type: 'Marquee Multiple Render Frames Per Second', actualValue: averageFPS});
			});
		}
	});
});

