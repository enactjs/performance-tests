/* global CPUThrottling, page, minFPS, maxCLS, stepNumber, maxFCP, maxINP, maxLCP, passRatio, serverAddr, targetEnv, webVitals, webVitalsPath */

const TestResults = require('../../TestResults');
const {FPS, getAverageFPS} = require('../../TraceModel');
const {collectWebVitals, newPageMultiple} = require('../../utils');

const component = 'VerticalMarquee';

const viewUrl = (query) => `http://${serverAddr}/#/verticalMarquee${query ? `?${query}` : ''}`;

const countCycles = async (targetPage) => {
	await targetPage.$eval('#verticalMarquee', (node) => {
		const track = node.querySelector('[data-vertical-marquee-track]');
		window.__verticalMarqueeEnds = 0;
		if (!track) return;

		track.addEventListener('transitionend', (ev) => {
			if (ev.target === track && (!ev.propertyName || ev.propertyName === 'transform')) {
				window.__verticalMarqueeEnds += 1;
			}
		});
	});
};

const waitForCycles = (targetPage) => targetPage.waitForFunction(() => window.__verticalMarqueeEnds >= 2, {timeout: 20000});

describe('VerticalMarquee', () => {
	TestResults.newFile(component);

	it('FPS on hover', async () => {
		await FPS();
		await page.emulateCPUThrottling(CPUThrottling);
		await page.goto(viewUrl('marqueeSpeed=4000'));
		await page.waitForSelector('#verticalMarquee');
		await countCycles(page);
		await page.hover('#verticalMarquee');
		await waitForCycles(page);

		const averageFPS = await getAverageFPS();
		TestResults.addResult({component: component, type: 'FPS', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

		expect(averageFPS).toBeGreaterThan(minFPS);
	});

	it('FPS on focus', async () => {
		await FPS();
		await page.emulateCPUThrottling(CPUThrottling);
		await page.goto(viewUrl('marqueeOn=focus&marqueeSpeed=4000'));
		await page.waitForSelector('#verticalMarquee');
		await countCycles(page);
		await page.mouse.move(0, 0);
		await page.$eval('#verticalMarquee', (node) => node.blur());
		await page.focus('#verticalMarquee');
		await waitForCycles(page);

		const averageFPS = await getAverageFPS();
		TestResults.addResult({component: component, type: 'FPS Focus', actualValue: Math.round((averageFPS + Number.EPSILON) * 1000) / 1000});

		expect(averageFPS).toBeGreaterThan(minFPS);
	});

	it('should have a good CLS, FCP, INP and LCP', async () => {
		let passContCLS = 0;
		let passContINP = 0;
		let passContFCP = 0;
		let passContLCP = 0;
		let avgCLS = 0;
		let avgINP = 0;
		let avgFCP = 0;
		let avgLCP = 0;
		for (let step = 0; step < stepNumber; step++) {
			const verticalMarqueePage = targetEnv === 'TV' ? page : await newPageMultiple();
			await verticalMarqueePage.emulateCPUThrottling(CPUThrottling);
			await verticalMarqueePage.goto(viewUrl('marqueeOn=focus&marqueeSpeed=4000'));
			await verticalMarqueePage.addScriptTag({path: webVitalsPath});
			await new Promise(r => setTimeout(r, 100));

			const stepVitals = collectWebVitals(verticalMarqueePage);

			await verticalMarqueePage.evaluateHandle(() => {
				webVitals.onINP(function (inp) {
					console.log(JSON.stringify({"name": inp.name, "value": inp.value})); // eslint-disable-line no-console
				},
				{
					reportAllChanges: true,
					durationThreshold: 0
				}
				);

				webVitals.onCLS(function (cls) {
					console.log(JSON.stringify({"name": cls.name, "value": cls.value})); // eslint-disable-line no-console
				},
				{
					reportAllChanges: true
				}
				);

				webVitals.onFCP(function (fcp) {
					console.log(JSON.stringify({"name": fcp.name, "value": fcp.value})); // eslint-disable-line no-console
				},
				{
					reportAllChanges: true
				}
				);

				webVitals.onLCP(function (lcp) {
					console.log(JSON.stringify({"name": lcp.name, "value": lcp.value})); // eslint-disable-line no-console
				},
				{
					reportAllChanges: true
				}
				);
			});

			await verticalMarqueePage.waitForSelector('#verticalMarquee');
			await new Promise(r => setTimeout(r, 200));
			await verticalMarqueePage.evaluate(() => {
				if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
			});
			await verticalMarqueePage.keyboard.down('ArrowDown');
			await verticalMarqueePage.keyboard.up('ArrowDown');
			await new Promise(r => setTimeout(r, 200));
			await new Promise(r => setTimeout(r, 1000));
			avgCLS = avgCLS + (stepVitals.CLS || 0);
			avgINP = avgINP + (stepVitals.INP || 0);
			avgFCP = avgFCP + (stepVitals.FCP || 0);
			avgLCP = avgLCP + (stepVitals.LCP || 0);

			if (stepVitals.CLS < maxCLS) passContCLS += 1;
			if (stepVitals.INP < maxINP) passContINP += 1;
			if (stepVitals.FCP < maxFCP) passContFCP += 1;
			if (stepVitals.LCP < maxLCP) passContLCP += 1;

			if (targetEnv === 'PC') await verticalMarqueePage.close();
		}

		avgCLS = avgCLS / stepNumber;
		avgINP = avgINP / stepNumber;
		avgFCP = avgFCP / stepNumber;
		avgLCP = avgLCP / stepNumber;

		TestResults.addResult({component: component, type: 'CLS', actualValue: Math.round((avgCLS + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'INP', actualValue: Math.round((avgINP + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'FCP', actualValue: Math.round((avgFCP + Number.EPSILON) * 1000) / 1000});
		TestResults.addResult({component: component, type: 'LCP', actualValue: Math.round((avgLCP + Number.EPSILON) * 1000) / 1000});

		expect(avgCLS).toBeLessThan(maxCLS);
		expect(avgINP).toBeLessThan(maxINP);
		expect(avgFCP).toBeLessThan(maxFCP);
		expect(avgLCP).toBeLessThan(maxLCP);

		expect(passContCLS).toBeGreaterThan(passRatio * stepNumber);
		expect(passContINP).toBeGreaterThan(passRatio * stepNumber);
		expect(passContFCP).toBeGreaterThan(passRatio * stepNumber);
		expect(passContLCP).toBeGreaterThan(passRatio * stepNumber);
	});
});
