/* eslint-disable no-undef */

function pad2 (n) {
	return n < 10 ? '0' + n : n;
}

function getFileName (testName) {
	const date = new Date();
	const formattedDate = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds());
	const filename = `./performance/traces/${testName}_${formattedDate}.json`;

	return filename;
}

async function scrollAtPoint (page, selector, amount) {
	await page.evaluate((scrollerSelector, scrollAmount) => {
		let evt = document.createEvent('MouseEvents');
		evt.initEvent('wheel', true, true);
		evt.deltaY = scrollAmount;
		const node = document.querySelector(scrollerSelector);
		node.dispatchEvent(evt);
	}, selector, amount);
}

const firstInputValue = () => {
	return page.evaluate(() => window.fid);
};

const clsValue = () => {
	return page.evaluate(() => window.cls);
};

const findFocusedNode = async (node) => {
	if (node.focused)
		return node;
	for (const child of node.children || []) {
		const foundNode =  await findFocusedNode(child);
		if(foundNode) return foundNode;
	}
	return null;
}

module.exports = {
	clsValue,
	findFocusedNode,
	firstInputValue,
	getFileName,
	scrollAtPoint
};
