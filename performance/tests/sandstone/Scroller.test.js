/* global CPUThrottling, page, minFPS, maxFID, maxCLS, stepNumber, maxDCL, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv */

const TestResults = require('../../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, firstInputValue, getFileName, newPageMultiple, scrollAtPoint} = require('../../utils');

describe( 'Scroller', () => {
	const component = 'Scroller';
	TestResults.newFile(component);

	describe('keypress', () => {
		it('scrolls down', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/scroller`);
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
			await page.goto(`http://${serverAddr}/scroller`);
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

	it('should have a good FID and CLS', async () => {
		await page.evaluateOnNewDocument(FID);
		await page.evaluateOnNewDocument(CLS);
		await page.goto(`http://${serverAddr}/scroller`);
		await page.waitForSelector('#scroller');
		await page.focus('[aria-label="scroll up or down with up down button"]');
		await page.keyboard.down('Enter');
		await page.keyboard.down('Enter');
		await new Promise(r => setTimeout(r, 2000));

		let actualFirstInput = await firstInputValue();
		let actualCLS = await clsValue();

		TestResults.addResult({component: component, type: 'FID', actualValue: Math.round((actualFirstInput + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

		expect(actualFirstInput).toBeLessThan(maxFID);
		expect(actualCLS).toBeLessThan(maxCLS);
	});

	it('should have a good INP', async () => {
		await page.goto(`http://${serverAddr}/scroller`);
		await page.addScriptTag({url: 'https://unpkg.com/web-vitals@4/dist/web-vitals.iife.js'});
		await page.waitForSelector('#scroller');
		await page.focus('[aria-label="scroll up or down with up down button"]');
		await page.keyboard.down('Enter');
		await page.keyboard.down('Enter');
		await new Promise(r => setTimeout(r, 2000));

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
			const scrollerPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await scrollerPage.emulateCPUThrottling(CPUThrottling);

			await scrollerPage.tracing.start({path: filename, screenshots: false});
			await scrollerPage.goto(`http://${serverAddr}/scroller`);
			await scrollerPage.waitForSelector('#scroller');
			await new Promise(r => setTimeout(r, 200));

			await scrollerPage.tracing.stop();

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

			if (targetEnv === 'PC') await scrollerPage.close();
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

	it('scroll down with 5-way with Scroller Native', async () => {
		await FPS();

		await page.goto(`http://${serverAddr}/scrollerMultipleChildren?count=100&type=ScrollerNative`);
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
