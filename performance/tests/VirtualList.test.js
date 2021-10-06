const TestResults = require('../TestResults');
const {DCL, FCP, FPS} = require('../TraceModel');
const {getFileName, scrollAtPoint} = require('../utils');

describe('VirtualList', () => {
	const component = 'VirtualList';
	TestResults.emptyFile(component);

	describe('ScrollButton', () => {
		it('scrolls down', async () => {
			const filename = getFileName('VirtualList');
			await page.goto('http://localhost:8080/virtualList');
			await page.tracing.start({path: filename, screenshots: false});
			await page.waitForSelector('#virtualList');
			await page.focus('[aria-label="scroll up or down with up down button"]');
			await page.keyboard.down('ArrowDown');
			await page.waitForTimeout(200);
			await page.keyboard.down('ArrowDown');
			await page.waitForTimeout(200);
			await page.keyboard.down('ArrowDown');
			await page.waitForTimeout(200);
			await page.keyboard.down('ArrowDown');
			await page.waitForTimeout(2000);

			await page.tracing.stop();

			const actual = FPS(filename);
			TestResults.addResult({component: 'VirtualList', type: 'Frames Per Second', actualValue: actual});
		});
	});

	describe('mousewheel', () => {
		it('scrolls down', async () => {
			const filename = getFileName('VirtualList');
			const VirtualList = '#virtualList';

			await page.goto('http://localhost:8080/virtualList');
			await page.tracing.start({path: filename, screenshots: false});
			await page.waitForSelector(VirtualList);
			await scrollAtPoint(page, VirtualList, 1000);
			await page.waitForTimeout(200);
			await scrollAtPoint(page, VirtualList, 1000);
			await page.waitForTimeout(200);
			await scrollAtPoint(page, VirtualList, 1000);
			await page.waitForTimeout(200);
			await scrollAtPoint(page, VirtualList, 1000);
			await page.waitForTimeout(200);

			await page.tracing.stop();

			const actual = FPS(filename);
			TestResults.addResult({component: 'VirtualList', type: 'Frames Per Second', actualValue: actual});
		});
	});

	it('should have a good First-Input time', async () => {
		const filename = getFileName(component);

		await page.goto('http://localhost:8080/virtualList');
		await page.tracing.start({path: filename, screenshots: false});
		await page.waitForSelector('#virtualList');
		await page.focus('#virtualList');
		await page.keyboard.down('Enter');

		await page.tracing.stop();

		const actualFirstInput = (await getCustomMetrics(page))['first-input'];
		TestResults.addResult({component: component, type: 'First Input', actualValue: actualFirstInput});
	});

	it('should have a good FCP', async () => {
		const filename = getFileName(component);

		let cont = 0;
		let avg = 0;
		for (let step = 0; step < stepNumber; step++) {
			const FCPPage = await testMultiple.newPage();

			await FCPPage.tracing.start({path: filename, screenshots: false});
			await FCPPage.goto('http://localhost:8080/virtualList');
			await FCPPage.waitForSelector('#virtualList');

			await FCPPage.tracing.stop();

			const actualFCP = await FCP(filename);
			avg = avg + actualFCP;

			if (actualFCP < maxFCP) {
				cont += 1;
			}
			await FCPPage.close();
		}
		avg = avg / stepNumber;

		TestResults.addResult({component: component, type: 'average FCP', actualValue: avg});

		expect(cont).toBeGreaterThan(percent);
		expect(avg).toBeLessThan(maxFCP);
	});

	it('should have a good DCL', async () => {
		const filename = getFileName(component);

		let cont = 0;
		let avg = 0;
		for (let step = 0; step < stepNumber; step++) {
			const DCLPage = await testMultiple.newPage();
			await DCLPage.tracing.start({path: filename, screenshots: false});
			await DCLPage.goto('http://localhost:8080/virtualList');
			await DCLPage.waitForSelector('#virtualList');

			await DCLPage.tracing.stop();

			const actualDCL = await DCL(filename);
			avg = avg + actualDCL;

			if (actualDCL < maxDCL) {
				cont += 1;
			}
			await DCLPage.close();
		}
		avg = avg / stepNumber;

		TestResults.addResult({component: component, type: 'average DCL', actualValue: avg});

		expect(cont).toBeGreaterThan(percent);
		expect(avg).toBeLessThan(maxDCL);
	});
});
