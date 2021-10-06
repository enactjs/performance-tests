const fs = require('fs');

const FPS = () =>  {
	let previousFrame, currentFrame;
	let FPSValues = [];
	previousFrame = performance.now();

	requestAnimationFrame(
		function calculateNewFPS () {
			currentFrame = performance.now();
			FPSValues.push(Math.round(1000 / (currentFrame - previousFrame)));
			previousFrame = currentFrame;
			requestAnimationFrame(calculateNewFPS);
		}
	);
	return FPSValues;
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

const LCP = (filename) => {
	const events = fs.readFileSync(filename, 'utf8');
	const result = JSON.parse(events);

	const baseEvent = result.traceEvents.filter(i => i.name == 'TracingStartedInBrowser')[0].ts;
	const largestContentfulPaint = result.traceEvents.filter(i => i.name == 'largestContentfulPaint::Candidate')[0].ts;

	const LCPTime = (largestContentfulPaint - baseEvent) / 1000;

	return LCPTime;
};

const FCP = (filename) => {
	const events = fs.readFileSync(filename, 'utf8');
	const result = JSON.parse(events);

	const baseEvent = result.traceEvents.filter(i => i.name == 'TracingStartedInBrowser')[0].ts;
	const firstContentfulPaint = result.traceEvents.filter(i => i.name == 'firstContentfulPaint')[0].ts;

	const FCPTime = (firstContentfulPaint - baseEvent) / 1000;

	return FCPTime;
};

const DCL = (filename) => {
	const events = fs.readFileSync(filename, 'utf8');
	const result = JSON.parse(events);

	const baseEvent = result.traceEvents.filter(i => i.name == 'TracingStartedInBrowser')[0].ts;
	const domContentLoadedEventEnd = result.traceEvents.filter(i => i.name == 'domContentLoadedEventEnd')[0].ts;

	const DCLTime = (domContentLoadedEventEnd - baseEvent) / 1000;

	return DCLTime;
};

module.exports = {
	CLS,
	DCL,
	FCP,
	FID,
	FPS,
	LCP
};
