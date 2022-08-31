/* global page, pageTV, targetEnv */

const os = require('os');

function pad2 (n) {
	return n < 10 ? '0' + n : n;
}

function getFileName (testName) {
	const date = new Date();
	const formattedDate = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds());

	return `./performance/traces/${testName}_${formattedDate}.json`;
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
	return targetEnv === 'TV' ? pageTV.evaluate(() => window.fid) : page.evaluate(() => window.fid);
};

const clsValue = () => {
	return targetEnv === 'TV' ? pageTV.evaluate(() => window.cls) : page.evaluate(() => window.cls);
};

const ipAddress = () => {
	const ifaces = os.networkInterfaces();
	let address = 'localhost';

	Object.keys(ifaces).forEach(function (ifname) {
		ifaces[ifname].forEach((iface) => {
			if (!iface || 'IPv4' !== iface.family || iface.internal !== false) {
				// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
				return;
			}
			address = iface.address;
		});
	});
	return address;
};

module.exports = {
	clsValue,
	firstInputValue,
	getFileName,
	ipAddress,
	scrollAtPoint
};
