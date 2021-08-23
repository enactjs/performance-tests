function getFirstInput(entries) {
	const appFirstInput = entries.find((x) => x.name === 'keydown');
	// We used keydown to test this (should work the same for click);
	return appFirstInput?.startTime ?? 0;
}

function getMountDuration(entries) {
	const appMountTime = entries.find((x) => x.phase === 'mount');

	return appMountTime?.startTime ?? 0;
}

function getUpdateDuration(entries) {
	const appUpdateTime = entries.filter(x => x.phase === 'update');
	let totalTime = 0;

	if(appUpdateTime.length > 0) {
		for (let aux in appUpdateTime) {
			totalTime += parseFloat(appUpdateTime[aux].actualDuration);
		}

		return totalTime / appUpdateTime.length;
	}
	return totalTime;
}

async function getCustomMetrics(page) {
	const rawEntries = await page.evaluate(function () {
		return JSON.stringify(window.performance.getEntries());
	});

	const rawProfilerData = await page.evaluate(function () {
		return JSON.stringify(window._prf);
	})

	const entries = JSON.parse(rawEntries);
	const profilerData = JSON.parse(rawProfilerData);

	return {
		'first-input': getFirstInput(entries),
		mount: getMountDuration(profilerData),
		update: getUpdateDuration(profilerData)
	};
}

module.exports = getCustomMetrics;