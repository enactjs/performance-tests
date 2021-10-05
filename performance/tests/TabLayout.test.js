const getCustomMetrics = require('../ProfilerMetrics');
const TestResults = require('../TestResults');
const {DCL, FCP, FPS} = require('../TraceModel');
const {getFileName} = require('../utils');

describe('TabLayout', () => {
	const component = 'TabLayout';
	TestResults.emptyFile(component);

	describe('keypress', () => {
		it('animates', async () => {
			const filename = getFileName(component);

			await page.goto('http://localhost:8080/tabLayout');
			await page.tracing.start({path: filename, screenshots: false});
			await page.waitForSelector('#tabLayout');
			await page.waitForTimeout(200);
			await page.keyboard.down('ArrowRight');
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

		await page.goto('http://localhost:8080/tabLayout');
		await page.tracing.start({path: filename, screenshots: false});
		await page.waitForSelector('#tabLayout');
		await page.keyboard.down('ArrowRight');

		await page.tracing.stop();

		const actualFirstInput = (await getCustomMetrics(page))['first-input'];
		TestResults.addResult({component: component, type: 'First Input', actualValue: actualFirstInput});
	});

	it('mount time', async () => {
		const filename = getFileName(component);

		await page.goto('http://localhost:8080/tabLayout');
		await page.tracing.start({path: filename, screenshots: false});
		await page.waitForSelector('#tabLayout');

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
			await FCPPage.goto('http://localhost:8080/tabLayout');
			await FCPPage.waitForSelector('#tabLayout');

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
			await DCLPage.goto('http://localhost:8080/tabLayout');
			await DCLPage.waitForSelector('#tabLayout');

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
