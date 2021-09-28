const getCustomMetrics = require('../ProfilerMetrics');
const TestResults = require('../TestResults');
const {DCL, FCP, FPS} = require('../TraceModel');
const {getFileName} = require('../utils');

describe('RangePicker', () => {
	const component = 'RangePicker';
	TestResults.emptyFile(component);

	describe('RangePickerDefault', () => {
		describe('click', () => {
			it('animates', async () => {
				const filename = getFileName(component);
				await page.goto('http://localhost:8080/rangePicker');
				await page.tracing.start({path: filename, screenshots: false});
				await page.waitForTimeout(500);

				await page.click('[aria-label$="press ok button to increase the value"]'); // to move mouse on the rangePicker.
				await page.mouse.down();
				await page.waitForTimeout(200);
				await page.mouse.up();
				await page.mouse.down();
				await page.waitForTimeout(200);
				await page.mouse.up();
				await page.mouse.down();
				await page.waitForTimeout(200);
				await page.mouse.up();
				await page.mouse.down();
				await page.waitForTimeout(200);
				await page.mouse.up();

				await page.tracing.stop();

				const actualFPS = FPS(filename);
				TestResults.addResult({component: 'RangePicker Default', type: 'Frames Per Second', actualValue: actualFPS});

				const actualUpdateTime = (await getCustomMetrics(page))['update'];
				TestResults.addResult({component: 'RangePicker Default', type: 'average Update Time', actualValue: actualUpdateTime});
			});
		});

		describe('keypress', () => {
			it('animates', async () => {
				const filename = getFileName(component);

				await page.goto('http://localhost:8080/rangePicker');
				await page.tracing.start({path: filename, screenshots: false});
				await page.waitForSelector('#rangePickerDefault');
				await page.focus('[aria-label$="press ok button to increase the value"]');
				await page.waitForTimeout(200);
				await page.keyboard.down('Enter');
				await page.waitForTimeout(200);
				await page.keyboard.up('Enter');
				await page.keyboard.down('Enter');
				await page.waitForTimeout(200);
				await page.keyboard.up('Enter');
				await page.keyboard.down('Enter');
				await page.waitForTimeout(200);
				await page.keyboard.up('Enter');
				await page.keyboard.down('Enter');
				await page.waitForTimeout(200);
				await page.keyboard.up('Enter');

				await page.tracing.stop();

				const actualFPS = FPS(filename);
				TestResults.addResult({component: 'RangePicker Default', type: 'Frames Per Second', actualValue: actualFPS});

				const actualUpdateTime = (await getCustomMetrics(page))['update'];
				TestResults.addResult({component: 'RangePicker Default', type: 'Average Update Time', actualValue: actualUpdateTime});
			});
		});

		it('should have a good First-Input time', async () => {
			const filename = getFileName(component);

			await page.goto('http://localhost:8080/rangePicker');
			await page.tracing.start({path: filename, screenshots: false});
			await page.waitForSelector('#rangePickerDefault');
			await page.waitForTimeout(100);
			await page.click('[aria-label$="press ok button to increase the value"]');
			await page.waitForTimeout(100);

			await page.tracing.stop();

			const actualFirstInput = (await getCustomMetrics(page))['first-input'];
			TestResults.addResult({component: component, type: 'First Input', actualValue: actualFirstInput});
		});
	});

	describe('RangePickerJoined', () => {
		describe('click', () => {
			it('animates', async () => {
				const filename = getFileName(component);
				await page.goto('http://localhost:8080/rangePicker');
				await page.tracing.start({path: filename, screenshots: false});
				await page.waitForTimeout(500);

				await page.click('#rangePickerJoined'); // to move mouse on the rangePicker.
				await page.mouse.down();
				await page.waitForTimeout(200);
				await page.mouse.up();
				await page.mouse.down();
				await page.waitForTimeout(200);
				await page.mouse.up();
				await page.mouse.down();
				await page.waitForTimeout(200);
				await page.mouse.up();
				await page.mouse.down();
				await page.waitForTimeout(200);
				await page.mouse.up();

				await page.tracing.stop();

				const actualFPS = FPS(filename);
				TestResults.addResult({component: 'RangePicker Joined', type: 'Frames Per Second', actualValue: actualFPS});

				const actualUpdateTime = (await getCustomMetrics(page))['update'];
				TestResults.addResult({component: 'RangePicker Joined', type: 'Average Update Time', actualValue: actualUpdateTime});
			});
		});

		describe('keypress', () => {
			it('animates', async () => {
				const filename = getFileName(component);

				await page.goto('http://localhost:8080/rangePicker');
				await page.tracing.start({path: filename, screenshots: false});
				await page.waitForSelector('#rangePickerJoined');
				await page.focus('#rangePickerJoined');
				await page.waitForTimeout(200);
				await page.keyboard.down('Enter');
				await page.waitForTimeout(200);
				await page.keyboard.up('Enter');
				await page.keyboard.down('Enter');
				await page.waitForTimeout(200);
				await page.keyboard.up('Enter');
				await page.keyboard.down('Enter');
				await page.waitForTimeout(200);
				await page.keyboard.up('Enter');
				await page.keyboard.down('Enter');
				await page.waitForTimeout(200);
				await page.keyboard.up('Enter');

				await page.tracing.stop();

				const actualFPS = FPS(filename);
				TestResults.addResult({component: 'RangePicker Joined', type: 'Frames Per Second', actualValue: actualFPS});

				const actualUpdateTime = (await getCustomMetrics(page))['update'];
				TestResults.addResult({component: 'RangePicker Joined', type: 'Average Update Time', actualValue: actualUpdateTime});
			});
		});

		it('should have a good First-Input time', async () => {
			const filename = getFileName(component);

			await page.goto('http://localhost:8080/rangePicker');
			await page.tracing.start({path: filename, screenshots: false});
			await page.waitForSelector('#rangePickerJoined');
			await page.waitForTimeout(100);
			await page.click('#rangePickerJoined');
			await page.waitForTimeout(100);

			await page.tracing.stop();

			const actualFirstInput = (await getCustomMetrics(page))['first-input'];
			TestResults.addResult({component: 'RangePicker Joined', type: 'First Input', actualValue: actualFirstInput});
		});
	});

	it('mount time', async () => {
		const filename = getFileName(component);

		await page.goto('http://localhost:8080/rangePicker');
		await page.tracing.start({path: filename, screenshots: false});
		await page.waitForSelector('#rangePickerDefault');
		await page.focus('#rangePickerDefault');

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
			await FCPPage.goto('http://localhost:8080/rangePicker');
			await FCPPage.waitForSelector('#rangePickerDefault');

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
			await DCLPage.goto('http://localhost:8080/rangePicker');
			await DCLPage.waitForSelector('#rangePickerDefault');

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
