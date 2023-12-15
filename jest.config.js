// sandstone or agate based on provided `--theme` command line argument
const themeEnvArg = process.argv.filter((x) => x.startsWith('--theme='))[0];
const base = themeEnvArg ? themeEnvArg.split('=')[1] : 'sandstone';

module.exports = {
	setupFilesAfterEnv: ['./jest.setup.js', './puppeteer.setup.js'],
	testEnvironment: 'jsdom',
	testMatch: [
		'<rootDir>/performance/tests/' + base + '/*.test.js'
	]
};
