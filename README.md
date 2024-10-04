# Enact Performance Testing

Application to perform automated performance testing on Enact components.

We utilize puppeteer to get chrome performance traces.

## Testing on PC

### Testing Sandstone components

You can start the server and run the test suite on it separately. Sandstone is the default theme, so you can simply use:

```
npm run serve
npm run test
```

Alternatively, you can use the test-all command to start the server and run the test suite together:

```
npm run test-all
```

If you need to test only a certain component, you can specify its name in the test command:

```
npm run test Alert
```

### Testing Agate components

Start the server with Agate components and run the test suite on it. You can specify the theme by adding --theme=agate at the end of the command:

```
npm run serve-agate
npm run test -- --theme=agate
```

```
npm run test-all -- --theme=agate
```

On Windows OS you might need to install `cross-env` globally with `npm install -g cross-env`.

## Testing on TV

Pass the IP address of the TV as an environment variable and use the `npm run test` task:

```bash
TV_IP=10.0.1.1 npm run test-all -- --target=TV --theme=sandstone
```

```bash
npm run serve-sandstone
TV_IP=10.0.1.1 npm run test -- --target=TV --theme=sandstone
```

## CPU Throttling

You can simulate a low-end device with a CPU throttling option. 1 is no throttle, 2 is 2x slowdown.
See the [Puppeteer API docs](https://pptr.dev/api/puppeteer.page.emulatecputhrottling) for the detailed information.

Available commands are:

### Testing on PC
Example:
If you want to run tests on the PC with CPU throttling with 3x slowdown, you can run this command:
```
npm run test -- --target=PC --theme=sandstone --throttling=3
npm run test -- --target=PC --theme=agate --throttling=3
```

### Testing on TV board
Example: 
If you want to run tests on the TV with a CPU throttling with 2x slowdown, you can run this command:
```
npm run test -- --target=TV --theme=sandstone --throttling=2
npm run test -- --target=TV --theme=agate --throttling=2
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

### INP

Interaction to Next Paint (INP) is a web performance metric that measures how quickly a website updates or shows changes after a user interacts with it. It specifically captures the delay between when a user interacts with your site—like clicking a link, pressing a key on the keyboard, or tapping a button—and when they see a visual response (see https://web.dev/articles/inp).
INP is calculated from the onINP() webVitals function. It logs the INP value in the console and we are monitoring the console in order to read the actual value.

### CLS

Cumulative Layout Shift (CLS) is "a measure of the largest burst of layout shift scores for every unexpected layout shift that occurs during the entire lifespan of a page. A layout shift occurs any time a visible element changes its position from one rendered frame to the next" (see https://web.dev/cls/).
CLS is calculated using the PerformanceObserver interface. Its observer() method specifies the set of entry types to observe (in this case layout-shift). The performance observer's callback function will be invoked when a performance entry is recorded for one of the specified entryTypes.

### Example

Each component is tested repeatedly for both `click` and `keypress` events to measure average FPS. 
CLS is tested separately because requires interactions. We can check the React Devtools to see which component is at the top of a specific component.
CLS is tested separately because it is read from using the `web-vitals` library.
DCL, FCP and LCP are also tested together as they are measured at page load time.

Results can be found in `testResults` folder.

Test results are compared to the optimum values which are stored in global variables declared in `puppeteer.setup` file.

**Metrics threshholds:**
- global.maxCLS = 0.1; 
- global.maxDCL = 2000; 
- global.maxFCP = 1800;
- global.maxINP = 200;
- global.minFPS = 20; 
- global.maxLCP = 2500;

```javascript
const TestResults = require('../TestResults');
const {FPS, getAverageFPS, PageLoadingMetrics} = require('../TraceModel');
const {getFileName, newPageMultiple} = require('../utils');

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

	it('should have a good CLS and INP', async () => {
		await page.goto(`http://${serverAddr}/dropdown`);
		await page.addScriptTag({url: webVitalsURL});
		await page.waitForSelector('#dropdown');
		await page.focus('#dropdown');
		await new Promise(r => setTimeout(r, 100));
		await page.keyboard.down('Enter');
		await new Promise(r => setTimeout(r, 100));

		let maxValue;

		page.on("console", (msg) => {
			let jsonMsg = JSON.parse(msg.text());
			if (jsonMsg.name === 'CLS') {
				maxValue = maxCLS;
			} else if (jsonMsg.name === 'INP') {
				maxValue = maxINP;
			}

			TestResults.addResult({component: component, type: jsonMsg.name, actualValue: Math.round((Number(jsonMsg.value) + Number.EPSILON) * 1000) / 1000});
			expect(Number(jsonMsg.value)).toBeLessThan(maxValue);
		});

		await page.evaluateHandle(() => {
			webVitals.onINP(function (inp) {
					console.log(JSON.stringify({"name": inp.name, "value": inp.value})); // eslint-disable-line no-console
				},
				{
					reportAllChanges: true
				}
			);

			webVitals.onCLS(function (cls) {
					console.log(JSON.stringify({"name": cls.name, "value": cls.value})); // eslint-disable-line no-console
				},
				{
					reportAllChanges: true
				}
			);
		});
		await new Promise(r => setTimeout(r, 1000));
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
