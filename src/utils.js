
const putRenderedMark = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
	if (!window._prf) {
		window._prf = [];
	}

	window._prf.push({id, phase, actualDuration, baseDuration, startTime, commitTime});

	if (!putRenderedMark._done) {
		putRenderedMark._done = true;
		window.performance.mark(id);
	}
};

export {
	putRenderedMark
};
