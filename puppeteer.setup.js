const puppeteer = require('puppeteer');

global.stepNumber = 5;
global.passRatio = 0.7;
global.maxCLS = 0.1;
global.maxDCL = 200;
global.maxFCP = 1800;
global.maxFID = 100;
global.minFPS = 20;
global.maxLCP = 2500;

let browser;

global.beforeAll(async () => {
	browser = await puppeteer.launch();
	global.testMultiple = browser;
});

global.beforeEach(async () => {
	const newPage = await browser.newPage();

	await newPage.setViewport({
		width: 1920,
		height: 1080
	});

	global.page = newPage;
});

global.afterEach(async () => {
	await page.close();
});

global.afterAll(async () => {
	await browser.close();
});
