/* global CPUThrottling, page, minFPS, maxFID, maxCLS, stepNumber, maxDCL, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv */

const {CLS, coreWebVitals, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, firstInputValue, getFileName, newPageMultiple} = require('../../utils');
const TestResults = require('../../TestResults');

describe('IncrementSlider', () => {
	const component = 'IncrementSlider';
	TestResults.newFile(component);

	describe('drag', () => {
		it('increment', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/incrementSlider`);
			await page.waitForSelector('#incrementSlider');
			const {x: posX, y: posY} = await page.evaluate(() => {
				const knobElement = document.querySelector('[class*="Slider_knob"]');
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
			await page.goto(`http://${serverAddr}/incrementSlider`);
			await page.waitForSelector('#incrementSlider');
			await page.focus('#incrementSlider');

			await page.keyboard.press('Enter');

			for (let i = 0; i < 100; i++) {
				await page.keyboard.down('ArrowRight');
			}

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Keypress', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	it('should have a good FID and CLS', async () => {
		await page.evaluateOnNewDocument(FID);
		await page.evaluateOnNewDocument(CLS);
		await page.goto(`http://${serverAddr}/incrementSlider`);
		await page.waitForSelector('#incrementSlider');
		await page.focus('#incrementSlider');
		await page.keyboard.down('Enter');
		await new Promise(r => setTimeout(r, 200));

		let actualFirstInput = await firstInputValue();
		let actualCLS = await clsValue();

		TestResults.addResult({component: component, type: 'FID', actualValue: Math.round((actualFirstInput + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

		expect(actualFirstInput).toBeLessThan(maxFID);
		expect(actualCLS).toBeLessThan(maxCLS);
	});

	it('should have a good INP', async () => {
		await page.goto(`http://${serverAddr}/incrementSlider`);
		await coreWebVitals.attachCwvLib(page);
		await page.waitForSelector('#incrementSlider');
		await page.focus('#incrementSlider');
		await page.keyboard.down('Enter');
		await new Promise(r => setTimeout(r, 200));

		let inpValue;

		page.on("console", (msg) => {
			inpValue = Number(msg.text());
			TestResults.addResult({component: component, type: 'INP', actualValue: Math.round((inpValue + Number.EPSILON) * 1000) / 1000});
			expect(inpValue).toBeLessThan(maxINP);
		});

		await page.evaluateHandle(() => {
			window.webVitals.getINP(function (inp) {
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
			const incrementSliderPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await incrementSliderPage.emulateCPUThrottling(CPUThrottling);

			await incrementSliderPage.tracing.start({path: filename, screenshots: false});
			await incrementSliderPage.goto(`http://${serverAddr}/incrementSlider`);
			await incrementSliderPage.waitForSelector('#incrementSlider');
			await new Promise(r => setTimeout(r, 200));

			await incrementSliderPage.tracing.stop();

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

			if (targetEnv === 'PC') await incrementSliderPage.close();
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

