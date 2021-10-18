const fs = require('fs');

const FPS = async () =>  {
	window.FPSValues = [];
	let previousFrame, currentFrame;
	previousFrame = performance.now();

	requestAnimationFrame(
		async function calculateNewFPS () {
			currentFrame = performance.now();
			window.FPSValues.push(Math.round(1000 / (currentFrame - previousFrame)));
			previousFrame = currentFrame;
			await requestAnimationFrame(calculateNewFPS);
		}
	);
};

const averageFPS = () => {
	return (window.FPSValues.reduce((a, b) => a + b, 0) / window.FPSValues.length) || 0;
}

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

const LoadingMetrics = (filename) => {
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
	averageFPS,
	CLS,
	FID,
	FPS,
	LoadingMetrics
};
