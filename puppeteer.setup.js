/* global page, targetEnv */

const puppeteer = require('puppeteer-core');
const {ipAddress} = require('./performance/utils');

global.maxCLS = 0.1;
global.maxDCL = 2000;
global.maxFCP = 1800;
global.maxFID = 100;
global.maxINP = 200;
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
global.webVitalsURL = 'https://unpkg.com/web-vitals@4.2.3/dist/web-vitals.iife.js';

if (targetEnv === 'PC') {
	global.beforeAll(async () => {
		browser = await puppeteer.launch({
			args: ['--window-size=1920,1080'],
			executablePath: require('puppeteer').executablePath(),
			headless: true
		});
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
