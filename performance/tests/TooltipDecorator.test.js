const getCustomMetrics = require('../ProfilerMetrics');
const TestResults = require('../TestResults');
const {DCL, FCP, FPS} = require('../TraceModel');
const {getFileName} = require('../utils');

describe('TooltipDecorator', () => {
	const component = 'TooltipDecorator';
	TestResults.emptyFile(component);

	describe('focus', () => {
		it('FPS and Update time', async () => {
			const filename = getFileName(component);

			await page.goto('http://localhost:8080/tooltipDecorator');
			await page.tracing.start({path: filename, screenshots: false});
			await page.waitForSelector('#tooltipDecorator');
			await page.focus('#tooltipDecorator');
			await page.waitForTimeout(200);

			await page.tracing.stop();

			const actualFPS = FPS(filename);
			TestResults.addResult({component: component, type: 'Frames Per Second', actualValue: actualFPS});

			const actualUpdateTime = (await getCustomMetrics(page))['update'];
			TestResults.addResult({component: component, type: 'average Update Time', actualValue: actualUpdateTime});
		});
	});

	it('should have a good First-Input time', async () => {
		const filename = getFileName(component);

		await page.goto('http://localhost:8080/tooltipDecorator');
		await page.tracing.start({path: filename, screenshots: false});
		await page.waitForSelector('#tooltipDecorator');
		await page.focus('#tooltipDecorator');
		await page.keyboard.down('Enter');

		await page.tracing.stop();

		const actualFirstInput = (await getCustomMetrics(page))['first-input'];
		TestResults.addResult({component: component, type: 'First Input', actualValue: actualFirstInput});
	});

	it('mount time', async () => {
		const filename = getFileName(component);

		await page.goto('http://localhost:8080/tooltipDecorator');
		await page.tracing.start({path: filename, screenshots: false});
		await page.waitForSelector('#tooltipDecorator');
		await page.focus('#tooltipDecorator');

		await page.tracing.stop();

		const actualMountTime = (await getCustomMetrics(page))['mount'];
		TestResults.addResult({component: component, type: 'Mount Time', actualValue: actualMountTime});
	});


	it('should have a good FCP', async () => {
		const filename = getFileName(component);

		let cont = 0;
		let avg = 0;
		for (let step = 0; step < stepNumber; step++) {
			const FCPPage = await testMultiple.newPage();

			await FCPPage.tracing.start({path: filename, screenshots: false});
			await FCPPage.goto('http://localhost:8080/tooltipDecorator');
			await FCPPage.waitForSelector('#tooltipDecorator');

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
			await DCLPage.goto('http://localhost:8080/tooltipDecorator');
			await DCLPage.waitForSelector('#tooltipDecorator');

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
