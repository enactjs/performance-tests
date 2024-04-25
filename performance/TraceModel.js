/* global requestAnimationFrame */

const fs = require('fs');

const windowSet = (page, name, value) => (
	page.evaluateOnNewDocument(`
    Object.defineProperty(window, '${name}', {
      get() {
        return '${value}'
      }
    })
  `)
);

const FPS = async (page) =>  {
	let fps = [];
	// window.FPSValues = [];
	let previousFrame, currentFrame;
	previousFrame = performance.now();

	const requestAnimationFrame =
	JSON.parse(await page.evaluate(
		() => JSON.stringify(window.document)));
	console.log(requestAnimationFrame)

	// requestAnimationFrame(
	// 	async function calculateNewFPS () {
	// 		currentFrame = performance.now();
	// 		fps.push(Math.round(1000 / (currentFrame - previousFrame)));
	// 		previousFrame = currentFrame;
	// 		requestAnimationFrame(calculateNewFPS);
	// 	}
	// );

	windowSet(page, 'FPSValues', fps);
};

const getAverageFPS = async (page) => {
	const FPS = await page.evaluate(`window.FPSValues.data`);
	console.log(FPS);
	return (FPS.reduce((a, b) => a + b, 0) / FPS.length) || 0;
};

const FID = () => {
	window.fid = 0;
	new PerformanceObserver(entryList => {
		let fidEntry = entryList.getEntries()[0];
		window.fid = fidEntry.processingStart - fidEntry.startTime;
	}).observe({type: 'first-input', buffered: true});
};

const CLS = () => {
	window.cls = 0;
	new PerformanceObserver(entryList => {
		let entries = entryList.getEntries() || [];
		entries.forEach(e => {
			if (!e.hadRecentInput) { // omit entries likely caused by user input
				window.cls += e.value;
			}
		});
	}).observe({type: 'layout-shift', buffered: true});
};

const PageLoadingMetrics = (filename) => {
	const events = fs.readFileSync(filename, 'utf8');
	const result = JSON.parse(events);

	const baseEvent = result.traceEvents.filter(i => i.name === 'TracingStartedInBrowser')[0].ts;

	const domContentLoadedEventEnd = result.traceEvents.filter(i => i.name === 'domContentLoadedEventEnd')[0].ts;
	const firstContentfulPaint = result.traceEvents.filter(i => i.name === 'firstContentfulPaint')[0].ts;
	const largestContentfulPaint = result.traceEvents.filter(i => i.name === 'largestContentfulPaint::Candidate')[0].ts;

	const actualDCL = (domContentLoadedEventEnd - baseEvent) / 1000;
	const actualFCP = (firstContentfulPaint - baseEvent) / 1000;
	const actualLCP = (largestContentfulPaint - baseEvent) / 1000;

	return {actualDCL, actualFCP, actualLCP};
};

module.exports = {
	CLS,
	FID,
	FPS,
	getAverageFPS,
	PageLoadingMetrics
};
