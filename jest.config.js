const path = require('path');

// limestone or agate based on provided `--theme` command line argument
const themeEnvArg = process.argv.filter((x) => x.startsWith('--theme='))[0];

// set base default to limestone
const base = themeEnvArg ? themeEnvArg.split('=')[1] : 'limestone';

module.exports = {
	// Performance benchmarks must run one at a time. Running multiple headless
	// browsers in parallel starves the CPU, which corrupts the FPS/INP numbers.
	maxWorkers: 1,
	setupFilesAfterEnv: [
		path.resolve(__dirname, 'jest.setup.js'), // eslint-disable-line no-undef
		path.resolve(__dirname, 'puppeteer.setup.js') // eslint-disable-line no-undef
	],
	testEnvironment: 'node',
	testMatch: [
		path.resolve(__dirname, 'performance/tests/', base, '*.test.js') // eslint-disable-line no-undef
	]
};
