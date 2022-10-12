/* global page, targetEnv */

const puppeteer = require('puppeteer-core');
const {ipAddress} = require('./performance/utils');

global.stepNumber = 5;
global.passRatio = 0.7;
global.maxCLS = 0.1;
global.maxDCL = 2000;
global.maxFCP = 1800;
global.maxFID = 100;
global.minFPS = 20;
global.maxLCP = 2500;

let browser;

const targetEnvArg = process.argv.filter((x) => x.startsWith('--target='))[0];
global.targetEnv = targetEnvArg ? targetEnvArg.split('=')[1] : 'PC';

global.serverAddr = `${ipAddress()}:8080`;

if (targetEnv === 'PC') {
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
} else if (targetEnv === 'TV') {
	global.beforeAll(async () => {
		const TVAddr = process.env.TV_IP;

		browser = await puppeteer.connect({
			browserURL: `http://${TVAddr}:9998`,
			ignoreHTTPSErrors: true
		});

		const pages = await browser.pages();

		global.testMultiple = browser;
		global.testPage = pages[0];
	});

	global.beforeEach(async () => {
		global.page = global.testPage;
		await global.page.setViewport({
			width: 1920,
			height: 1080
		});
	});

	global.afterAll(async () => {
		await browser.close();
	});
}
