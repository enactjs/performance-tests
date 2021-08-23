const puppeteer = require('puppeteer');

global.stepNumber = 10;
global.percent = 7;
global.maxFCP = 1800;
global.maxDCL = 2000;

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

	//const client = await newPage.target().createCDPSession();
	//await client.send('Emulation.setCPUThrottlingRate', {rate: 6});
	global.page = newPage;
});

global.afterEach(async () => {
	await page.close();
});

global.afterAll(async () => {
	await browser.close();
});
