const puppeteer = require('puppeteer');
const {FPS, Mount, Update} = require('../TraceModel');
const {getFileName} = require('../utils');
const TestResults = require('../TestResults');

describe('Popup', () => {
	let browser, page;

	beforeEach(async () => {
		browser = await puppeteer.launch({headless: true});

		page = await browser.newPage();
		await page.setViewport({
			width: 1920,
			height: 1080
		});

		const client = await page.target().createCDPSession();
		await client.send('Emulation.setCPUThrottlingRate', {rate: 6});
	});

	afterEach(async () => {
		await browser.close();
	});

	it('open and close', async () => {
		const filename = getFileName('Popup');
		const open = '#button-open';
		const close = '#button-close';

		await page.goto('http://localhost:8080/popup');
		await page.tracing.start({path: filename, screenshots: false});
		await page.waitForSelector('#popup');
		await page.click(close);
		await page.waitFor(500);
		await page.click(open);
		await page.waitFor(500);
		await page.click(close);
		await page.waitFor(500);
		await page.click(open);
		await page.waitFor(500);
		await page.click(close);
		await page.waitFor(500);

		await page.tracing.stop();

		const actualFPS = FPS(filename);
		TestResults.addResult({component: 'Popup', type: 'Frames Per Second', actualValue: actualFPS});

		const actualUpdateTime = Update(filename, 'Popup');
		TestResults.addResult({component: 'Popup', type: 'Update', actualValue: actualUpdateTime});

	});

	it('should mount Popup under threshold', async () => {
		const filename = getFileName('Popup');

		await page.tracing.start({path: filename, screenshots: true});
		await page.goto('http://localhost:8080/popup');
		await page.waitForSelector('#popup');

		await page.tracing.stop();

		const actualMount = Mount(filename, 'Popup');
		TestResults.addResult({component: 'Popup', type: 'Mount', actualValue: actualMount});
	});
});

