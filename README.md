# Enact Performance Testing

Application to perform automated performance testing on Enact components.

We utilize puppeteer to get chrome performance traces.


To run all you have to do is start the server and run the test suite on it.
```
npm run serve
npm run test
```

## Adding Tests

This project works a bit differently than a regular test suite for now. We have Jest installed more as a test runner, but we don't really use assertions for now. We use it more to gather and report numbers.

### FCP

First Contentful Paint (FCP) measures the total time taken from the beginning of a page load to the point any content is rendered on the screen.
To get FCP we use the `PageLoadingMetrics` function from `TraceModel`.

### DCL

DOM Content Loaded (DCL) is the time during the process of loading a webpage when the DOM (Document Object Model) has been assembled by the browser, and no stylesheets are preventing JavaScript from executing. In short, it measures the time when the HTML document has been completely loaded and read.
To get DCL we use the `PageLoadingMetrics` function from `TraceModel`.

### LCP

The Largest Contentful Paint (LCP) metric reports the render time of the largest image or text block visible within the viewport, relative to when the page first started loading.
To get LCP we use the `PageLoadingMetrics` function from `TraceModel`.

### FPS

Frames per second (FPS) is a unit that measures display device performance in video captures and playback and video games. FPS is used to measure frame rate -- the number of images consecutively displayed each second -- and is a common metric used in video capture and playback when discussing video quality. In our case we use it to measure component animation performance.
To gather average FPS time, we just use the `FPS` function from `TraceModel`.
For FPS we don't need to specify any components to look for as it will just grab the FPS for the entire page.

### FID

First Input Delay (FID) measures the time from when a user first interacts with a page (i.e. when they click a link, tap on a button, or use a custom, JavaScript-powered control) to the time when the browser is actually able to begin processing event handlers in response to that interaction.
To get FID we use the `FID` function from `TraceModel`.

### CLS

Cumulative Layout Shift (CLS) is a measure of the largest burst of layout shift scores for every unexpected layout shift that occurs during the entire lifespan of a page.
A layout shift occurs any time a visible element changes its position from one rendered frame to the next.
To get CLS we use the `CLS` function from `TraceModel`.

### Example

Each component is tested repeatedly for both `click` and `keypress` events to measure average FPS. 
FID and CLS are tested in the same test because they both typically require interactions. We can check the React Devtools to see which component is at the top of a specific component.
DCL, FCP and LCP are also tested together as they are measured at page load time.

Results can be found in `testResults` folder. 

### Comparing results 

Test results are compared to the optimum values which are stored in global variables declared in `puppeteer.setup` file.

```Metrics threshholds:```
global.maxCLS = 0.1;
global.maxDCL = 2000;
global.maxFCP = 1800;
global.maxFID = 100;
global.minFPS = 20;
global.maxLCP = 2500;

```javascript
const TestResults = require('../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../TraceModel');
const {clsValue, firstInputValue, getFileName} = require('../utils');

describe('Dropdown', () => {
	const component = 'Dropdown';
	TestResults.newFile(component);

	describe('click', () => {
		it('animates', async () => {
			await FPS();
			await page.goto('http://localhost:8080/dropdown');
			await page.waitForSelector('#dropdown');
			await page.click('#dropdown'); // to move mouse on dropdown
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

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Click', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	describe('keypress', () => {
		it('animates', async () => {
			await FPS();
			await page.goto('http://localhost:8080/dropdown');
			await page.waitForSelector('#dropdown');
			await page.focus('#dropdown');
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

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Keypress', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	it('should have a good FID and CLS', async () => {
		await page.evaluateOnNewDocument(FID);
		await page.evaluateOnNewDocument(CLS);
		await page.goto('http://localhost:8080/dropdown');
		await page.waitForSelector('#dropdown');
		await page.focus('#dropdown');
		await page.keyboard.down('Enter');

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
			const dropdownPage = await testMultiple.newPage();

			await dropdownPage.tracing.start({path: filename, screenshots: false});
			await dropdownPage.goto('http://localhost:8080/dropdown');
			await dropdownPage.waitForSelector('#dropdown');
			await dropdownPage.waitForTimeout(200);

			await dropdownPage.tracing.stop();

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

			await dropdownPage.close();
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
```

### Google Sheets

We have the ability to send data to a Google Spreadsheet. If you wish to use this includes an environment variable. 

```
// .env
API_URL=https://script.google.com/macros/s/SCRIPT_ID/exec
```
