/* global page, requestAnimationFrame */

// Registers a script that runs in the browser page on the next navigation and
// starts a requestAnimationFrame loop there, so frame times are measured in the
// actual page under test rather than in the Jest process.
const FPS = async () => {
	await page.evaluateOnNewDocument(() => {
		// guard against multiple registrations starting duplicate loops (e.g. when the same page is reused on TV)
		if (window.FPSLoopStarted) return;
		window.FPSLoopStarted = true;
		window.FPSValues = [];
		let previousFrame = performance.now();

		requestAnimationFrame(
			function calculateNewFPS (currentFrame) {
				window.FPSValues.push(Math.round(1000 / (currentFrame - previousFrame)));
				previousFrame = currentFrame;
				requestAnimationFrame(calculateNewFPS);
			}
		);
	});
};

const getAverageFPS = () => page.evaluate(() => {
	const FPSValues = window.FPSValues || [];

	return (FPSValues.reduce((a, b) => a + b, 0) / FPSValues.length) || 0;
});

module.exports = {
	FPS,
	getAverageFPS
};
