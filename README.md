# Enact Performance Testing

Application to perform automated performance testing on Enact components.

We utilize puppeteer to get chrome performance traces.

## Testing on PC

### Testing Limestone components

You can start the server and run the test suite on it separately. Limestone is the default theme, so you can simply use:

```
npm run serve
npm run test
```

Alternatively, you can use the test-all command to start the server and run the test suite together:

```
npm run test-all
```

### Testing Sandstone components

Start the server with Sandstone components and run the test suite on it. You can specify the theme by adding --theme=sandstone at the end of the command:

```
npm run serve-sandstone
npm run test -- --theme=sandstone
```

```
npm run test-all -- --theme=sandstone
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
TV_IP=10.0.1.1 npm run test-all -- --target=TV --theme=limestone
```

```bash
npm run serve-limestone
TV_IP=10.0.1.1 npm run test -- --target=TV --theme=limestone
```

## CPU Throttling

You can simulate a low-end device with a CPU throttling option. 1 is no throttle, 2 is 2x slowdown.
See the [Puppeteer API docs](https://pptr.dev/api/puppeteer.page.emulatecputhrottling) for the detailed information.

Available commands are:

### Testing on PC
Example:
If you want to run tests on the PC with CPU throttling with 3x slowdown, you can run this command:
```
npm run test -- --target=PC --theme=limestone --throttling=3
npm run test -- --target=PC --theme=sandstone --throttling=3
npm run test -- --target=PC --theme=agate --throttling=3
```

### Testing on TV board
Example: 
If you want to run tests on the TV with a CPU throttling with 2x slowdown, you can run this command:
```
npm run test -- --target=TV --theme=limestone --throttling=2
npm run test -- --target=TV --theme=sandstone --throttling=2
npm run test -- --target=TV --theme=agate --throttling=2
```

## Adding Tests

This project works a bit differently than a regular test suite for now. We have Jest installed more as a test runner, but we don't really use assertions for now. We use it more to gather and report numbers.

### FCP

First Contentful Paint (FCP) "measures the total time taken from the beginning of a page load to the point any content is rendered on the screen" (see https://web.dev/fcp/).
FCP is calculated from the onFCP() webVitals function. It logs the INP value in the console and we are monitoring the console in order to read the actual value.

### LCP

The Largest Contentful Paint (LCP) metric "reports the render time of the largest image or text block visible within the viewport, relative to when the page first started loading" (see https://web.dev/lcp/).
LCP is calculated from the onLCP() webVitals function. It logs the INP value in the console and we are monitoring the console in order to read the actual value.

### FPS

Frames per second (FPS) measures video quality (how many images are displayed consecutively each second). We use it to measure component animation performance.
FPS is read using the performance.now() method and Window.requestAnimationFrame() for the entire life span of the page. Just before the page is closed the average FPS is calculated.

### INP

Interaction to Next Paint (INP) is a web performance metric that measures how quickly a website updates or shows changes after a user interacts with it. It specifically captures the delay between when a user interacts with your site—like clicking a link, pressing a key on the keyboard, or tapping a button—and when they see a visual response (see https://web.dev/articles/inp).
INP is calculated from the onINP() webVitals function. It logs the INP value in the console and we are monitoring the console in order to read the actual value.

### CLS

Cumulative Layout Shift (CLS) is "a measure of the largest burst of layout shift scores for every unexpected layout shift that occurs during the entire lifespan of a page. A layout shift occurs any time a visible element changes its position from one rendered frame to the next" (see https://web.dev/cls/).
CLS is calculated from the onCLS() webVitals function. It logs the INP value in the console and we are monitoring the console in order to read the actual value.

### Example

Each component is tested repeatedly for both `click` and `keypress` events to measure average FPS. 
CLS, INP, FCP and LCP are tested together as they are measured at page load time and require interaction. Also they require multiple runs to measure average value

Results can be found in `testResults` folder.

Test results are compared to the optimum values which are stored in global variables declared in `puppeteer.setup` file.

**Metrics threshholds:**
- global.maxCLS = 0.1;
- global.maxFCP = 1800;
- global.maxINP = 200;
- global.minFPS = 20; 
- global.maxLCP = 2500;

```javascript
const TestResults = require('../TestResults');
const {FPS, getAverageFPS} = require('../TraceModel');
const {newPageMultiple} = require('../utils');

describe('Dropdown', () => {
	const component = 'Dropdown';
	TestResults.newFile(component);

	describe('click', () => {
		it('animates', async () => {
			await FPS();
			await page.goto(`http://${serverAddr}/#/dropdown`);
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
			await page.goto(`http://${serverAddr}/#/dropdown`);
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

	it('should have a good CLS, FCP, INP and LCP', async () => {
		let passContCLS = 0;
		let passContINP = 0;
		let passContFCP = 0;
		let passContLCP = 0;
		let avgCLS = 0;
		let avgINP = 0;
		let avgFCP = 0;
		let avgLCP = 0;
		for (let step = 0; step < stepNumber; step++) {
			const dropdownPage = targetEnv === 'TV' ? page : await newPageMultiple();
			await dropdownPage.emulateCPUThrottling(CPUThrottling);
			await dropdownPage.goto(`http://${serverAddr}/#/dropdown`);
			await dropdownPage.addScriptTag({url: webVitalsURL});
			await dropdownPage.waitForSelector('#dropdown');
			await dropdownPage.focus('#dropdown');
			await new Promise(r => setTimeout(r, 200));
			await dropdownPage.keyboard.down('Enter');
			await dropdownPage.keyboard.up('Enter');
			await new Promise(r => setTimeout(r, 200));


			dropdownPage.on("console", (msg) => {
				let jsonMsg = {};
				
				if (isValidJSON(msg.text())) {
					jsonMsg = JSON.parse(msg.text());
				}

				if (jsonMsg.name === 'CLS') {
					avgCLS = avgCLS + jsonMsg.value;
					if (jsonMsg.value < maxCLS) {
						passContCLS += 1;
					}
				} else if (jsonMsg.name === 'INP') {
					avgINP = avgINP + jsonMsg.value;
					if (jsonMsg.value < maxINP) {
						passContINP += 1;
					}
				} else if (jsonMsg.name === 'FCP') {
					avgFCP = avgFCP + jsonMsg.value;
					if (jsonMsg.value < maxFCP) {
						passContFCP += 1;
					}
				} else if (jsonMsg.name === 'LCP') {
					avgLCP = avgLCP + jsonMsg.value;
					if (jsonMsg.value < maxLCP) {
						passContLCP += 1;
					}
				}
			});

			await dropdownPage.evaluateHandle(() => {
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

				webVitals.onFCP(function (fcp) {
						console.log(JSON.stringify({"name": fcp.name, "value": fcp.value})); // eslint-disable-line no-console
					},
					{
						reportAllChanges: true
					}
				);

				webVitals.onLCP(function (lcp) {
						console.log(JSON.stringify({"name": lcp.name, "value": lcp.value})); // eslint-disable-line no-console
					},
					{
						reportAllChanges: true
					}
				);
			});
			await new Promise(r => setTimeout(r, 1000));

			if (targetEnv === 'PC') await dropdownPage.close();
		}

		avgCLS = avgCLS / stepNumber;
		avgINP = avgINP / stepNumber;
		avgFCP = avgFCP / stepNumber;
		avgLCP = avgLCP / stepNumber;

		TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((avgCLS + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'INP', actualValue: Math.round((avgINP + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'FCP', actualValue: Math.round((avgFCP + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'LCP', actualValue: Math.round((avgLCP + Number.EPSILON) * 1000) / 1000});

		expect(avgCLS).toBeLessThan(maxCLS);
		expect(avgINP).toBeLessThan(maxINP);
		expect(avgFCP).toBeLessThan(maxFCP);
		expect(avgLCP).toBeLessThan(maxLCP);

		expect(passContCLS).toBeGreaterThan(passRatio * stepNumber);
		expect(passContINP).toBeGreaterThan(passRatio * stepNumber);
		expect(passContFCP).toBeGreaterThan(passRatio * stepNumber);
		expect(passContLCP).toBeGreaterThan(passRatio * stepNumber);
	});
});
```

### Google Sheets

We have the ability to send data to a Google Spreadsheet. If you wish to use this, include an environment variable. 

```
// .env
API_URL=https://script.google.com/macros/s/SCRIPT_ID/exec
```
