/* global page */

function pad2 (n) {
	return n < 10 ? '0' + n : n;
}

function getFileName (testName) {
	const date = new Date();
	const formattedDate = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds());
	const filename = `./performance/traces/${testName}_${formattedDate}.json`;

	return filename;
}

async function scrollAtPoint (utilsPage, selector, amount) {
	await utilsPage.evaluate((scrollerSelector, scrollAmount) => {
		let evt = document.createEvent('MouseEvents');
		evt.initEvent('wheel', true, true);
		evt.deltaY = scrollAmount;
		const node = document.querySelector(scrollerSelector);
		node.dispatchEvent(evt);
	}, selector, amount);
}

const firstInputValue = () => {
	return pageTV.evaluate(() => window.fid);
};

const clsValue = () => {
	return pageTV.evaluate(() => window.cls);
};

module.exports = {
	clsValue,
	firstInputValue,
	getFileName,
	scrollAtPoint
};
