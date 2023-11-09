let base;

if (process.env.REACT_APP_AGATE) {
	base = 'agate';
} else {
	base = 'sandstone'
}

module.exports = {
	setupFilesAfterEnv: ['./jest.setup.js', './puppeteer.setup.js'],
	testEnvironment: 'jsdom',
	testMatch: [
		'<rootDir>/performance/tests/' + base + '/*.test.js'
	]
};
