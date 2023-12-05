let base;

const testAgateComponents = process.argv.some(arg => arg === '--library=agate');

if (testAgateComponents) {
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
