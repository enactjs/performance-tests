/* global page */

const puppeteer = require('puppeteer');
global.stepNumber = 5;
global.passRatio = 0.7;
global.maxCLS = 0.1;
global.maxDCL = 2000;
global.maxFCP = 1800;
global.maxFID = 100;
global.minFPS = 20;
global.maxLCP = 2500;

let browser;


global.beforeAll(async () => {
	// tried to open remote in remote debugging to see what happens
	browser = await puppeteer.launch({
		"args": [
			'--remote-debugging-port=9998',
			'--remote-debugging-address=192.168.100.52',
			"--window-size=1920,1080",
		],
		"defaultViewport": {
			"height": 1080,
			"width": 1920
		},
		"headless": false
	});

	// // tried to connect to a sideloaded page to see what happens
	// const browserURL = 'http://192.168.100.52:9998';
	// browser = await puppeteer.connect({browserURL});

	global.testMultipleTV = browser;
});

global.beforeEach(async () => {
	const newPageTV = await browser.newPage(); // does not work with connect
	console.log(browser);

	await newPageTV.setViewport({
		width: 1920,
		height: 1080
	});

	global.pageTV = newPageTV;
});

global.afterEach(async () => {
	await pageTV.close();
});

global.afterAll(async () => {
	await browser.close();
});
