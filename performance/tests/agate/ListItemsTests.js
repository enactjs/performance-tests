/* global CPUThrottling, page, minFPS, maxCLS, stepNumber, maxDCL, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsURL */
/* eslint-disable*/

const TestResults = require('../../TestResults');
const {CLS, FPS, getAverageFPS, PageLoadingMetrics} = require('../../TraceModel');
const {clsValue, getFileName, newPageMultiple, scrollAtPoint} = require('../../utils');

const listItemTests = (componentName, dataSize) => describe(componentName, () => {
	jest.setTimeout(100000);

	const component = componentName + (dataSize ? dataSize : '');
	TestResults.newFile(component);
	const pageURL = dataSize ? `http://${serverAddr}/${componentName}?dataSize=${dataSize}` : `http://${serverAddr}/${componentName}`;

	describe('ScrollButton', () => {
		it('scrolls down with native scrollMode', async () => {
			const pageURLNative = dataSize ? pageURL + '&scrollMode=native' : pageURL + '?scrollMode=native';

			await FPS();
			await page.goto(pageURLNative);
			await page.waitForSelector(`#${componentName}`);
			await page.focus('[aria-label="scroll down"]');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.down('Enter');
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
			await page.focus('[aria-label="scroll down"]');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.down('Enter');
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
			const pageURLTranslate = pageURL + '&scrollMode=translate';

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

	it('should have a good CLS', async () => {	
		await page.evaluateOnNewDocument(CLS);
		await page.goto(pageURL);
		await page.waitForSelector(`#${componentName}`);
		await page.focus(`#${componentName}`);
		await page.keyboard.down('Enter');

		let actualCLS = await clsValue();

		TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

		expect(actualCLS).toBeLessThan(maxCLS);
	});

	it('should have a good INP', async () => {
		await page.goto(pageURL);
		await page.addScriptTag({url: webVitalsURL});
		await page.waitForSelector(`#${componentName}`);
		await page.focus(`#${componentName}`);
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.down('ArrowDown');
		await page.keyboard.up('ArrowDown');
		await new Promise(r => setTimeout(r, 200));
		await page.keyboard.down('Enter');
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
			const ListPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await ListPage.emulateCPUThrottling(CPUThrottling);

			await ListPage.tracing.start({path: filename, screenshots: false});
			await ListPage.goto(pageURL);
			await ListPage.waitForSelector(`#${componentName}`);
			await new Promise(r => setTimeout(r, 200));

			await ListPage.tracing.stop();

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

			if (targetEnv === 'PC') await ListPage.close();
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

exports.listItemTests = listItemTests;

/* eslint-enable*/
