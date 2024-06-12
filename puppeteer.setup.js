/* global __BROWSER_GLOBAL__, page, targetEnv */

const puppeteer = require('puppeteer-core');
const {ipAddress} = require('./performance/utils');

global.maxCLS = 0.1;
global.maxDCL = 2000;
global.maxFCP = 1800;
global.maxFID = 100;
global.maxLCP = 2500;
global.minFPS = 20;
global.passRatio = 0.7;
global.stepNumber = 5;

let browser;

const targetCPUThrottling = process.argv.filter((x) => x.startsWith('--throttling='))[0];
const targetEnvArg = process.argv.filter((x) => x.startsWith('--target='))[0];

global.CPUThrottling = targetCPUThrottling ? parseInt(targetCPUThrottling.split('=')[1]) : 1;
global.targetEnv = targetEnvArg ? targetEnvArg.split('=')[1] : 'PC';

global.serverAddr = `${ipAddress()}:8080`;
global.testMultiple = globalThis.__BROWSER_GLOBAL__;

if (targetEnv === 'PC') {
	global.beforeEach(async () => {
		const newPage = await globalThis.__BROWSER_GLOBAL__.newPage();

		await newPage.setViewport({
			width: 1920,
			height: 1080
		});

		global.page = newPage;
	});

	global.afterEach(async () => {
		await page.close();
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
