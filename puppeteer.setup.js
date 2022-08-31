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

const targetArg= process.argv.filter((x) => x.startsWith('--target='))[0];
const target= targetArg ? targetArg.split('=')[1] : 'PC';


global.beforeAll(async () => {
	// tried to open remote in remote debugging to see what happens
	// browser = await puppeteer.launch();
console.log(process.argv.filter((x) => x.startsWith('--target='))[0])
	// tried to connect to a sideloaded page to see what happens
	//const TVAddr ="192.168.100.55:9998";
	const TVAddr ="10.255.248.96:9998";

	browser = await puppeteer.connect({
		browserURL: `http://${TVAddr}`,
		ignoreHTTPSErrors: true
	  });

	const pages = await browser.pages();
	const pagesCount = pages.length;

	global.testMultiple = browser;
	global.testMultipleTV = browser;
	global.testPage = pages[0];
	//global.serverAddr="192.168.100.7:8080";
	global.serverAddr="10.255.248.98:8080";


});

global.beforeEach(async () => {
	console.log("BeforeEach");
	// const newPageTV = await browser.newPage(); // does not work with connect
	const newPageTV = global.testPage; // does not work with connect
	// console.log(browser);

	// await newPageTV.setViewport({
	// 	width: 1920,
	// 	height: 1080
	// });

	// global.pageTV = newPageTV;
	global.pageTV = global.testPage;
	await global.pageTV.setViewport({
		width: 1920,
		height: 1080
	});
});

global.afterEach(async () => {
	//await pageTV.close();
});

global.afterAll(async () => {
	await browser.close();
});
