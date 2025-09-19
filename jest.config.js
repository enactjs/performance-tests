const path = require('path');

// limestone or agate based on provided `--theme` command line argument
const themeEnvArg = process.argv.filter((x) => x.startsWith('--theme='))[0];

// set base default to limestone
const base = themeEnvArg ? themeEnvArg.split('=')[1] : 'limestone';

module.exports = {
	setupFilesAfterEnv: [
		path.resolve(__dirname, 'jest.setup.js'),
		path.resolve(__dirname, 'puppeteer.setup.js'),
	],
	testEnvironment: path.resolve(__dirname, 'jsdom-extended.js'),
	testMatch: [
		path.resolve(__dirname, 'performance/tests/', base, '*.test.js')
	],
};
