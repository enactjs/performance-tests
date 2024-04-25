// sandstone or agate based on provided `--theme` command line argument
const themeEnvArg = process.argv.filter((x) => x.startsWith('--theme='))[0];

// set base default to sandstone
const base = themeEnvArg ? themeEnvArg.split('=')[1] : 'sandstone';

module.exports = {
	globalSetup: './setup.js',
	globalTeardown: './teardown.js',
	testEnvironment: './puppeteer_environment.js',
	setupFilesAfterEnv: ['./jest.setup.js', './puppeteer.setup.js'],
	testMatch: [
		'<rootDir>/performance/tests/' + base + '/*.test.js'
	]

};
