const TestResults = require('../TestResults');
const {FPS} = require('../TraceModel');
const {getFileName} = require('../utils');
describe('Picker', () => {
	// describe('click', () => {
	// 	it('increment', async () => {
	// 		const filename = getFileName('Picker');
	// 		const incrementer = '[class^="Picker_incrementer"]';
	// 		await page.goto('http://localhost:8080/picker');
	// 		await page.tracing.start({path: filename, screenshots: false});
	// 		await page.waitForTimeout(500);
	// 		await page.click(incrementer);
	// 		await page.waitForTimeout(200);
	// 		await page.click(incrementer);
	// 		await page.waitForTimeout(200);
	// 		await page.click(incrementer);
	// 		await page.waitForTimeout(200);
	// 		await page.click(incrementer);
	// 		await page.waitForTimeout(200);
	//
	// 		await page.tracing.stop();
	//
	// 		const actualFPS = FPS(filename);
	// 		TestResults.addResult({component: 'Picker', type: 'Frames Per Second', actualValue: actualFPS});
	//
	// 		const actualUpdateTime = Update(filename, 'Changeable');
	// 		TestResults.addResult({component: 'Picker', type: 'Update', actualValue: actualUpdateTime});
	//
	// 	});
	// });
	//
	// describe('keypress', () => {
	// 	it('increment', async () => {
	// 		const filename = getFileName('Picker');
	// 		await page.goto('http://localhost:8080/picker');
	// 		await page.tracing.start({path: filename, screenshots: false});
	// 		await page.waitForTimeout(500);
	// 		await page.keyboard.press('ArrowRight');
	// 		await page.waitForTimeout(200);
	// 		await page.keyboard.press('ArrowRight');
	// 		await page.waitForTimeout(200);
	// 		await page.keyboard.press('ArrowRight');
	// 		await page.waitForTimeout(200);
	// 		await page.keyboard.press('ArrowRight');
	// 		await page.waitForTimeout(200);
	// 		await page.keyboard.press('ArrowRight');
	// 		await page.waitForTimeout(200);
	//
	// 		await page.tracing.stop();
	//
	// 		const actualFPS = FPS(filename);
	// 		TestResults.addResult({component: 'Picker', type: 'Frames Per Second', actualValue: actualFPS});
	//
	// 		const actualUpdateTime = Update(filename, 'Changeable');
	// 		TestResults.addResult({component: 'Picker', type: 'Update', actualValue: actualUpdateTime});
	// 	});
	// });
	//
	// it('should mount picker under threshold', async () => {
	// 	const filename = getFileName('Picker');
	//
	// 	await page.tracing.start({path: filename, screenshots: false});
	// 	await page.goto('http://localhost:8080/picker');
	// 	await page.waitForTimeout(2000);
	//
	// 	await page.tracing.stop();
	//
	// 	const actualMount = Mount(filename, 'Changeable');
	// 	TestResults.addResult({component: 'Picker', type: 'Mount', actualValue: actualMount});
	// });
});

