const fs = require('fs');
const DevtoolsTimelineModel = require('devtools-timeline-model');

let FPSValues = [];
const FPS = () => {
	let before, now;
	before = performance.now();

	requestAnimationFrame(
		function loop() {
			now = performance.now();
			FPSValues.push(Math.round(1000 / (now - before)));
			before = now;
			requestAnimationFrame(loop);
			//console.log("fps", FPSValues)
		}
	);
	console.log(FPSValues);
	console.log(FPSValues.length);
	return FPSValues;

};

const LCP = (filename) => {
	const events = fs.readFileSync(filename, 'utf8');
	const result = JSON.parse(events);

	const baseEvent = result.traceEvents.filter(i => i.name == 'TracingStartedInBrowser')[0].ts;
	const largestContentfulPaint = result.traceEvents.filter(i => i.name == 'largestContentfulPaint::Candidate')[0].ts;

	const LCPTime = (largestContentfulPaint - baseEvent) / 1000;

	return LCPTime;
}

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

const Mount = (filename, component) => {
	const events = fs.readFileSync(filename, 'utf8');
	const model = new DevtoolsTimelineModel(events);
	const results = model.timelineModel();

	const userTiming = Array.from(results._namedTracks.values())[0];
	const timingEvents = userTiming.asyncEvents;

	// retrieve mount timing
	const mountTiming = timingEvents.find((item) => item.name === `⚛ ${component} [mount]`).duration;

	return mountTiming;
};

const Update = (filename, component) => {
	const events = fs.readFileSync(filename, 'utf8');
	const model = new DevtoolsTimelineModel(events);
	const results = model.timelineModel();

	const userTiming = Array.from(results._namedTracks.values())[0];
	const timingEvents = userTiming.asyncEvents;

	// filter our component update data
	const updateData = timingEvents.filter((item) => {
		return item.name === `⚛ ${component} [update]`;
	});

	const updates = updateData.length;
	const avgUpdateTiming = updateData.reduce((accumulator, currentValue) => accumulator + currentValue.duration, 0) / updates;

	return avgUpdateTiming;
};

module.exports = {
	DCL,
	FCP,
	FPS,
	LCP,
	Mount,
	Update
};
