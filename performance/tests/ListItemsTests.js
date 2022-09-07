/* global page, minFPS, maxFID, maxCLS, stepNumber, testMultiple, maxDCL, maxFCP, maxLCP, passRatio, serverAddr, targetEnv */
/* eslint-disable*/

const TestResults = require('../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../TraceModel');
const {clsValue, firstInputValue, getFileName, scrollAtPoint} = require('../utils');

const listItemTests = (componentName, dataSize) => describe(componentName, () => {
	jest.setTimeout(100000);

	const component = componentName + (dataSize ? dataSize : '');
	TestResults.newFile(component);
	const pageURL = dataSize ? `http://${serverAddr}/${componentName}?dataSize=${dataSize}` : `http://${serverAddr}/${componentName}`;

	describe('ScrollButton', () => {
		it('scrolls down', async () => {
			await FPS();
			await listItemsPage.goto(pageURL);
			await listItemsPage.waitForSelector(`#${componentName}`);
			await listItemsPage.focus('[aria-label="scroll up or down with up down button"]');
			await listItemsPage.keyboard.down('ArrowDown');
			await listItemsPage.waitForTimeout(200);
			await listItemsPage.keyboard.down('ArrowDown');
			await listItemsPage.waitForTimeout(200);
			await listItemsPage.keyboard.down('ArrowDown');
			await listItemsPage.waitForTimeout(200);
			await listItemsPage.keyboard.down('ArrowDown');
			await listItemsPage.waitForTimeout(2000);

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Keypress', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	describe('mousewheel', () => {
		it('scrolls down', async () => {
			await FPS();
			const List = `#${componentName}`;

			await listItemsPage.goto(pageURL);
			await listItemsPage.waitForSelector(List);
			await scrollAtPoint(page, List, 1000);
			await listItemsPage.waitForTimeout(200);
			await scrollAtPoint(page, List, 1000);
			await listItemsPage.waitForTimeout(200);
			await scrollAtPoint(page, List, 1000);
			await listItemsPage.waitForTimeout(200);
			await scrollAtPoint(page, List, 1000);
			await listItemsPage.waitForTimeout(200);

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Mousewheel', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	it('should have a good FID and CLS', async () => {
		await listItemsPage.evaluateOnNewDocument(FID);
		await listItemsPage.evaluateOnNewDocument(CLS);
		await listItemsPage.goto(pageURL);
		await listItemsPage.waitForSelector(`#${componentName}`);
		await listItemsPage.focus(`#${componentName}`);
		await listItemsPage.keyboard.down('Enter');

		let actualFirstInput = await firstInputValue();
		let actualCLS = await clsValue();

		TestResults.addResult({component: component, type: 'FID', actualValue: Math.round((actualFirstInput + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((actualCLS + Number.EPSILON) * 1000) / 1000});

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
			const ListPage = await testMultiple.newPage();

			await ListPage.tracing.start({path: filename, screenshots: false});
			await ListPage.goto(pageURL);
			await ListPage.waitForSelector(`#${componentName}`);
			await ListPage.waitForTimeout(200);

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
