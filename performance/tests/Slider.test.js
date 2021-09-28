const getCustomMetrics = require('../ProfilerMetrics');
const {DCL, FCP, FPS} = require('../TraceModel');
const {getFileName} = require('../utils');
const TestResults = require('../TestResults');

describe('Slider', () => {
	const component = 'Steps';
	TestResults.emptyFile(component);

	describe('drag', () => {
		it('increment', async () => {
			const filename = getFileName('Slider');
			await page.goto('http://localhost:8080/slider');
			await page.tracing.start({path: filename, screenshots: false});
			await page.waitForSelector('#slider');
			const {x: posX, y: posY} = await page.evaluate(() => {
				const knobElement = document.querySelector('[class$="Slider_knob"]');
				const {x, y} = knobElement.getBoundingClientRect();
				return {x, y};
			});

			await page.mouse.move(posX, posY);
			await page.mouse.down();


			for (let i = 0; i < 100; i++) {
				await page.mouse.move(posX + (i * 10), posY);
			}

			await page.tracing.stop();

			const actualFPS = FPS(filename);
			TestResults.addResult({component: 'Slider', type: 'Frames Per Second', actualValue: actualFPS});

			const actualUpdateTime = (await getCustomMetrics(page))['update'];
			TestResults.addResult({component: component, type: 'average Update Time', actualValue: actualUpdateTime});
		});
	});

	describe('keyboard', () => {
		it('increment', async () => {
			const filename = getFileName('Slider');
			await page.goto('http://localhost:8080/slider');
			await page.tracing.start({path: filename, screenshots: false});
			await page.waitForSelector('#slider');
			await page.focus('#slider');

			await page.keyboard.press('Enter');

			for (let i = 0; i < 100; i++) {
				await page.keyboard.down('ArrowRight');
			}

			await page.tracing.stop();

			const actualFPS = FPS(filename);
			TestResults.addResult({component: 'Slider', type: 'Frames Per Second', actualValue: actualFPS});

			const actualUpdateTime = (await getCustomMetrics(page))['update'];
			TestResults.addResult({component: component, type: 'average Update Time', actualValue: actualUpdateTime});
		});
	});

	it('mount time', async () => {
		const filename = getFileName(component);

		await page.goto('http://localhost:8080/slider');
		await page.tracing.start({path: filename, screenshots: false});
		await page.waitForSelector('#slider');

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
			await FCPPage.goto('http://localhost:8080/slider');
			await FCPPage.waitForSelector('#slider');
			await FCPPage.waitForTimeout(200);

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
			await DCLPage.goto('http://localhost:8080/slider');
			await DCLPage.waitForSelector('#slider');
			await DCLPage.waitForTimeout(200);

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

