const TestResults = require('../TestResults');
const {CLS, DCL, FCP, FID, FPS, LCP} = require('../TraceModel');
const {getFileName} = require('../utils');

describe('Button', () => {
	const component = 'Button';
	TestResults.emptyFile(component);

	describe('click', () => {
		it('animates', async () => {
			const FPSValues = await FPS();
			await page.goto('http://localhost:8080/button');
			await page.waitForTimeout(500);
			await page.click('#button'); // to move mouse on the button.
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

			const averageFPS = (FPSValues.reduce((a, b) => a + b, 0) / FPSValues.length) || 0;
			TestResults.addResult({component: component, type: 'Frames Per Second', actualValue: averageFPS });

		});
	});

	describe('keypress', () => {
		it('animates', async () => {
			const FPSValues = await FPS();
			await page.goto('http://localhost:8080/button');
			await page.waitForSelector('#button');
			await page.focus('#button');
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

			const averageFPS = (FPSValues.reduce((a, b) => a + b, 0) / FPSValues.length) || 0;
			TestResults.addResult({component: component, type: 'Frames Per Second', actualValue: averageFPS });
		});
	});

	it('should have a good First-Input Delay', async () => {
		await page.evaluateOnNewDocument(FID);
		await page.goto('http://localhost:8080/button');
		await page.waitForSelector('#button');
		await page.focus('#button');
		await page.keyboard.down('Enter');
		await page.waitForTimeout(200);

		let actualFirstInput = await page.evaluate(() => {
			return window.fid;
		});

		TestResults.addResult({component: component, type: 'First Input Delay', actualValue: actualFirstInput});

		expect(actualFirstInput).toBeLessThan(maxFID);
	});

	it('should have a good CLS', async () => {
		await page.evaluateOnNewDocument(CLS);
		await page.goto('http://localhost:8080/button');
		await page.waitForSelector('#button');
		await page.focus('#button');
		await page.keyboard.down('Enter');
		await page.waitForTimeout(200);

		let actualCLS = await page.evaluate(() => {
			return window.cls;
		});

		TestResults.addResult({component: component, type: 'CLS', actualValue: actualCLS});

		expect(actualCLS).toBeLessThan(maxCLS);
	});

	it('should have a good FCP', async () => {
		const filename = getFileName(component);

		let cont = 0;
		let avg = 0;
		for (let step = 0; step < stepNumber; step++) {
			const FCPPage = await testMultiple.newPage();

			await FCPPage.tracing.start({path: filename, screenshots: false});
			await FCPPage.goto('http://localhost:8080/button');
			await FCPPage.waitForSelector('#button');
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
			await DCLPage.goto('http://localhost:8080/button');
			await DCLPage.waitForSelector('#button');

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


	it('should have a good LCP', async () => {
		const filename = getFileName(component);

		let cont = 0;
		let avg = 0;
		for (let step = 0; step < stepNumber; step++) {
			const LCPPage = await testMultiple.newPage();

			await LCPPage.tracing.start({path: filename, screenshots: false});
			await LCPPage.goto('http://localhost:8080/button');
			await LCPPage.waitForSelector('#button');
			await LCPPage.waitForTimeout(200);

			await LCPPage.tracing.stop();

			const actualLCP = await LCP(filename);
			avg = avg + actualLCP;

			if (actualLCP < maxLCP) {
				cont += 1;
			}
			await LCPPage.close();
		}
		avg = avg / stepNumber;

		TestResults.addResult({component: component, type: 'average LCP', actualValue: avg});

		expect(cont).toBeGreaterThan(percent);
		expect(avg).toBeLessThan(maxLCP);
	});
});

