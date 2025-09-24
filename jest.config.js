const path = require('path');

// limestone or agate based on provided `--theme` command line argument
const themeEnvArg = process.argv.filter((x) => x.startsWith('--theme='))[0];

// set base default to limestone
const base = themeEnvArg ? themeEnvArg.split('=')[1] : 'limestone';

module.exports = {
	setupFilesAfterEnv: [
		path.resolve(__dirname, 'jest.setup.js'), // eslint-disable-line no-undef
		path.resolve(__dirname, 'puppeteer.setup.js') // eslint-disable-line no-undef
	],
	testEnvironment: path.resolve(__dirname, 'jsdom-extended.js'), // eslint-disable-line no-undef
	testMatch: [
		path.resolve(__dirname, 'performance/tests/', base, '*.test.js') // eslint-disable-line no-undef
	]
};
