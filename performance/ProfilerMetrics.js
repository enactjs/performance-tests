function getFirstInput(entries) {
	const appFirstInput = entries.find((x) => x.name === "keydown");
	// We used keydown to test this (should work the same for click);
	return appFirstInput?.startTime ?? 0;
}

async function getCustomMetrics(page) {
	const rawEntries = await page.evaluate(function () {
		return JSON.stringify(window.performance.getEntries());
	});

	const entries = JSON.parse(rawEntries);

	return {
		'first-input': getFirstInput(entries),
	};
}

module.exports = getCustomMetrics;