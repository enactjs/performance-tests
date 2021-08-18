const fs = require('fs');
const DevtoolsTimelineModel = require('devtools-timeline-model');

const FPS = (filename) => {
	const events = fs.readFileSync(filename, 'utf8');
	const model = new DevtoolsTimelineModel(events);
	const results = model.frameModel();

	let counter = 0;
	const avgDuration = results._frames.reduce((accumulator, currentValue) => {
		if (!currentValue.idle) {
			counter += 1;
			return accumulator + 1000 / currentValue.duration;
		} else {
			return accumulator;
		}
	}, 0) / counter;

	return avgDuration;
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
	Mount,
	Update
};
