const TestResults = require('../TestResults');
const {DCL, FCP, FPS} = require('../TraceModel');
const {getFileName} = require('../utils');

describe('DatePicker', () => {
	const component = 'DatePicker';
	TestResults.emptyFile(component);

	describe('click', () => {
		it('animates', async () => {
			const FPSValues = await FPS();
			await page.goto('http://localhost:8080/datePicker');
			await page.waitForTimeout(500);
			await page.click('[data-webos-voice-group-label="month"]'); // to move mouse on the increment button.
			await page.mouse.down();
			await page.waitForTimeout(200);
			await page.mouse.up();
			await page.click('[data-webos-voice-group-label="day"]'); // to move mouse on the increment button.
			await page.mouse.down();
			await page.waitForTimeout(200);
			await page.mouse.up();
			await page.click('[data-webos-voice-group-label="year"]'); // to move mouse on the increment button.
			await page.mouse.down();
			await page.waitForTimeout(200);
			await page.mouse.up();
			await page.click('[data-webos-voice-group-label="month"]'); // to move mouse on the increment button.
			await page.mouse.down();
			await page.waitForTimeout(200);
			await page.mouse.up();

			const actualFPS = FPS(filename);
			TestResults.addResult({component: component, type: 'Frames Per Second', actualValue: actualFPS});
		});
	});

	describe('keypress', () => {
		it('animates', async () => {
			const FPSValues = await FPS();
			await page.goto('http://localhost:8080/datePicker');
			await page.waitForSelector('[data-webos-voice-group-label="month"]');
			await page.focus('[data-webos-voice-group-label="month"]');
			await page.waitForTimeout(200);
			await page.keyboard.down('Enter');
			await page.waitForTimeout(200);
			await page.keyboard.up('Enter');
			await page.focus('[data-webos-voice-group-label="day"]');
			await page.waitForTimeout(200);
			await page.keyboard.down('Enter');
			await page.waitForTimeout(200);
			await page.keyboard.up('Enter');
			await page.focus('[data-webos-voice-group-label="year"]');
			await page.waitForTimeout(200);
			await page.keyboard.down('Enter');
			await page.waitForTimeout(200);
			await page.keyboard.up('Enter');
			await page.focus('[data-webos-voice-group-label="month"]');
			await page.waitForTimeout(200);
			await page.keyboard.down('Enter');
			await page.waitForTimeout(200);
			await page.keyboard.up('Enter');

			const averageFPS = (FPSValues.reduce((a, b) => a + b, 0) / FPSValues.length) || 0;
			TestResults.addResult({component: component, type: 'Frames Per Second Click', actualValue: averageFPS});
		});
	});

	it('should have a good First-Input time', async () => {
		const filename = getFileName(component);

		await page.goto('http://localhost:8080/datePicker');
		await page.tracing.start({path: filename, screenshots: false});
		await page.waitForSelector('[data-webos-voice-group-label="month"]');
		await page.focus('[data-webos-voice-group-label="month"]');
		await page.keyboard.down('Enter');

		await page.tracing.stop();

		const averageFPS = (FPSValues.reduce((a, b) => a + b, 0) / FPSValues.length) || 0;
		TestResults.addResult({component: component, type: 'Frames Per Second Keypress', actualValue: averageFPS});
	});

	it('should have a good FCP', async () => {
		const filename = getFileName(component);

		let cont = 0;
		let avg = 0;
		for (let step = 0; step < stepNumber; step++) {
			const FCPPage = await testMultiple.newPage();

			await FCPPage.tracing.start({path: filename, screenshots: false});
			await FCPPage.goto('http://localhost:8080/datePicker');
			await FCPPage.waitForSelector('[data-webos-voice-group-label="month"]');

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
			await DCLPage.goto('http://localhost:8080/datePicker');
			await DCLPage.waitForSelector('[data-webos-voice-group-label="month"]');

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

