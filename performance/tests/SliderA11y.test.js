/* eslint-disable no-undef */
const {findFocusedNode} = require('../utils');

describe('SliderA11y', () => {
	describe('Horizontal Slider', () => {
		it('should have correct `slider` role and `0 change a value with left right button` valuetext', async () => {
			await page.goto('http://localhost:8080/sliderA11y');
			await page.waitForSelector('#horizontalSlider');
			await page.waitForTimeout(1000);
			await page.keyboard.down('ArrowDown');
			await page.waitForTimeout(500);
			await page.keyboard.up('ArrowDown');
			await page.waitForTimeout(500);

			const snapshot = await page.accessibility.snapshot();
			const node = await findFocusedNode(snapshot);

			expect(node.role).toEqual('slider');
			expect(node.valuetext).toEqual('0 change a value with left right button');
		});

		it('change slider knob', async () => {
			await page.goto('http://localhost:8080/sliderA11y');
			await page.waitForSelector('#horizontalSlider');
			await page.waitForTimeout(1000);
			for (let i = 0; i < 5; i++) {
				await page.keyboard.down('ArrowRight');
				await page.waitForTimeout(500);
			}

			const snapshot = await page.accessibility.snapshot();
			const node = await findFocusedNode(snapshot);

			expect(node.role).toEqual('slider');
			expect(node.valuetext).toEqual('5');
		});
	});

	describe('Vertical Slider', () => {
		it('should have correct `slider` role and `0 change a value with up down button` valuetext', async () => {
			await page.goto('http://localhost:8080/sliderA11y');
			await page.waitForSelector('#verticalSlider');
			await page.waitForTimeout(1000);
			await page.keyboard.down('ArrowDown');
			await page.waitForTimeout(500);
			await page.keyboard.up('ArrowDown');
			await page.waitForTimeout(500);

			const snapshot = await page.accessibility.snapshot();
			const node = await findFocusedNode(snapshot);

			expect(node.role).toEqual('slider');
			expect(node.valuetext).toEqual('0 change a value with up down button');
		});

		it('change slider knob', async () => {
			await page.goto('http://localhost:8080/sliderA11y');
			await page.waitForSelector('#verticalSlider');
			await page.waitForTimeout(1000);
			await page.keyboard.down('ArrowDown');
			await page.waitForTimeout(500);
			await page.keyboard.up('ArrowDown');
			await page.waitForTimeout(500);

			for (let i = 0; i < 5; i++) {
				await page.keyboard.down('ArrowUp');
				await page.waitForTimeout(500);
			};

			const snapshot = await page.accessibility.snapshot();
			const node = await findFocusedNode(snapshot);

			expect(node.role).toEqual('slider');
			expect(node.valuetext).toEqual('5');
		});
	});
});
