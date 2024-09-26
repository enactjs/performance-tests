/* global requestAnimationFrame */

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

const getAverageFPS = () => (window.FPSValues.reduce((a, b) => a + b, 0) / window.FPSValues.length) || 0;

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
	FPS,
	getAverageFPS,
	PageLoadingMetrics
};
