// limestone or agate based on provided `--theme` command line argument
const themeEnvArg = process.argv.filter((x) => x.startsWith('--theme='))[0];

// set base default to limestone
const base = themeEnvArg ? themeEnvArg.split('=')[1] : 'limestone';

module.exports = {
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '<rootDir>/puppeteer.setup.js'],
	testEnvironment: '<rootDir>/jsdom-extended.js',
	testMatch: [
		'<rootDir>/performance/tests/' + base + '/*.test.js'
	]
};
