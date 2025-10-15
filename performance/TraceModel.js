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

module.exports = {
	FPS,
	getAverageFPS
};
