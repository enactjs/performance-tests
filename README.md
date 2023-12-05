# Enact Performance Testing

Application to perform automated performance testing on Enact components.

We utilize puppeteer to get chrome performance traces.

## Testing on PC

To run all you have to do is start the server and run the test suite on it.
```
npm run test-all
```

```
npm run serve
npm run test
```

## Testing on TV

Pass the IP address of the TV as an environment variable and use the `npm run test-tv` task:

```bash
TV_IP=10.0.1.1 npm run test-all-tv
```

```bash
npm run serve
TV_IP=10.0.1.1 npm run test-tv
```

## Testing Agate components
Start the server with Agate components and run the test suite on it
```
npm run serve-agate
npm run test-agate
```

## CPU Throttling

You can simulate a low-end device with a CPU throttling option. 1 is no throttle, 2 is 2x slowdown.

See the [Puppeteer API docs](https://pptr.dev/api/puppeteer.page.emulatecputhrottling) for the detailed information.

Available commands are:

### Testing on PC
Example:
If you want to run tests on the PC with CPU throttling with 3x slowdown, you can run this command:
```
npm run test -- --throttling=3
```

### Testing on TV board
Example: 
If you want to run tests on the TV with a CPU throttling with 2x slowdown, you can run this command:
```
npm run test-tv -- --throttling=2
```

## Adding Tests

This project works a bit differently than a regular test suite for now. We have Jest installed more as a test runner, but we don't really use assertions for now. We use it more to gather and report numbers.

### FCP

First Contentful Paint (FCP) "measures the total time taken from the beginning of a page load to the point any content is rendered on the screen" (see https://web.dev/fcp/).
To get FCP we use the `PageLoadingMetrics` function from `TraceModel`.

### DCL

DOM Content Loaded (DCL) "marks the point when both the DOM is ready and there are no stylesheets that are blocking JavaScript execution" (see https://web.dev/critical-rendering-path-measure-crp/). In other words, it measures the time when the HTML document has been completely loaded and read.
To get DCL we use the `PageLoadingMetrics` function from `TraceModel`.

### LCP

The Largest Contentful Paint (LCP) metric "reports the render time of the largest image or text block visible within the viewport, relative to when the page first started loading" (see https://web.dev/lcp/).
To get LCP we use the `PageLoadingMetrics` function from `TraceModel`.

### FPS

Frames per second (FPS) measures video quality (how many images are displayed consecutively each second). We use it to measure component animation performance.
FPS is read using the performance.now() method and Window.requestAnimationFrame() for the entire life span of the page. Just before the page is closed the average FPS is calculated.

### FID

First Input Delay (FID) measures "the time from when a user first interacts with a page (i.e. when they click a link, tap on a button, or use a custom, JavaScript-powered control) to the time when the browser is actually able to begin processing event handlers in response to that interaction" (see https://web.dev/fid/).
FID is calculated using the PerformanceObserver interface. Its observer() method specifies the set of entry types to observe (in this case first-input). The performance observer's callback function will be invoked when a performance entry is recorded for one of the specified entryTypes.

### CLS

Cumulative Layout Shift (CLS) is "a measure of the largest burst of layout shift scores for every unexpected layout shift that occurs during the entire lifespan of a page. A layout shift occurs any time a visible element changes its position from one rendered frame to the next" (see https://web.dev/cls/).
CLS is calculated using the PerformanceObserver interface. Its observer() method specifies the set of entry types to observe (in this case layout-shift). The performance observer's callback function will be invoked when a performance entry is recorded for one of the specified entryTypes.

### Example

Each component is tested repeatedly for both `click` and `keypress` events to measure average FPS. 
FID and CLS are tested in the same test because they both typically require interactions. We can check the React Devtools to see which component is at the top of a specific component.
DCL, FCP and LCP are also tested together as they are measured at page load time.

Results can be found in `testResults` folder.

Test results are compared to the optimum values which are stored in global variables declared in `puppeteer.setup` file.

**Metrics threshholds:**
- global.maxCLS = 0.1; 
- global.maxDCL = 2000; 
- global.maxFCP = 1800; 
- global.maxFID = 100; 
- global.minFPS = 20; 
- global.maxLCP = 2500;

```javascript
const TestResults = require('../TestResults');
const {CLS, FID, FPS, getAverageFPS, PageLoadingMetrics} = require('../TraceModel');
const {clsValue, firstInputValue, getFileName, newPageMultiple} = require('../utils');

describe('Dropdown', () => {
	const component = 'Dropdown';
	TestResults.newFile(component);

	describe('click', () => {
		it('animates', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/dropdown`);
			await page.waitForSelector('#dropdown');
			await page.click('#dropdown'); // to move mouse on dropdown
			await page.mouse.down();
			await new Promise(r => setTimeout(r, 200));
			await page.mouse.up();
			await page.mouse.down();
			await new Promise(r => setTimeout(r, 200));
			await page.mouse.up();
			await page.mouse.down();
			await new Promise(r => setTimeout(r, 200));
			await page.mouse.up();
			await page.mouse.down();
			await new Promise(r => setTimeout(r, 200));
			await page.mouse.up();

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Click', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	describe('keypress', () => {
		it('animates', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/dropdown`);
			await page.waitForSelector('#dropdown');
			await page.focus('#dropdown');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.up('Enter');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.up('Enter');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.up('Enter');
			await page.keyboard.down('Enter');
			await new Promise(r => setTimeout(r, 200));
			await page.keyboard.up('Enter');

			const averageFPS = await getAverageFPS();
			TestResults.addResult({component: component, type: 'FPS Keypress', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

			expect(averageFPS).toBeGreaterThan(minFPS);
		});
	});

	it('should have a good FID and CLS', async () => {
		await page.evaluateOnNewDocument(FID);
		await page.evaluateOnNewDocument(CLS);
		await page.goto(`http://${serverAddr}/dropdown`);
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
			const dropdownPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await dropdownPage.emulateCPUThrottling(CPUThrottling);

			await dropdownPage.tracing.start({path: filename, screenshots: false});
			await dropdownPage.goto(`http://${serverAddr}/dropdown`);
			await dropdownPage.waitForSelector('#dropdown');
			await new Promise(r => setTimeout(r, 200));

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

			if (targetEnv === 'PC') await dropdownPage.close();
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

We have the ability to send data to a Google Spreadsheet. If you wish to use this, include an environment variable. 

```
// .env
API_URL=https://script.google.com/macros/s/SCRIPT_ID/exec
```
