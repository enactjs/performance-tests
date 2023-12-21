require('dotenv').config();
const  fs = require('fs');
const path = require('path');
const fetchAPI = (...args) => import('node-fetch').then(({default: fetchData}) => fetchData(...args));

const {version: ReactVersion} = require('react/package.json');
const {version: EnactVersion} = require('@enact/core/package.json');
const {version: SandstoneVersion} = require('@enact/sandstone/package.json');
const {version: AgateVersion} = require('@enact/agate/package.json');

const API_URL = process.env.API_URL;
const themeEnvArg = process.argv.filter((x) => x.startsWith('--theme='))[0];

// set default theme to sandstone
const theme = themeEnvArg ? themeEnvArg.split('=')[1] : 'sandstone';

const TestResult = module.exports = {
	results: [],
	addResult: ({component, type, actualValue}) => {
		const timestamp = Date.now();
		let result;
		if (theme === 'sandstone') {
			result = {ReactVersion, EnactVersion, SandstoneVersion, timestamp, component, type, actualValue};
		} else if (theme === 'agate') {
			result = {ReactVersion, EnactVersion, AgateVersion, timestamp, component, type, actualValue};
		}
		TestResult.results.push(result);
		// batch this in the future
		if (API_URL) {
			fetchAPI(API_URL, {
				method: 'POST',
				body: JSON.stringify(result),
				headers: {'Content-Type': 'application/json'}}
			)
				.then(res => console.log(res.json()))
				.catch(err => console.log(err));
		} else {
			console.log(JSON.stringify(result));
			let txtPath;
			if (theme === 'sandstone') {
				txtPath = path.join(__dirname, 'testResults/sandstone', `${component}.txt`); // eslint-disable-line
			} else if (theme === 'agate') {
				txtPath = path.join(__dirname, 'testResults/agate', `${component}.txt`); // eslint-disable-line
			}

			fs.appendFileSync(txtPath, JSON.stringify(result) + '\n');
		}
	},
	newFile: (component) => {
		const dir = 'testResults';

		if (theme === 'sandstone') {
			if (!fs.existsSync('performance/' + dir) || !fs.existsSync('performance/' + dir + '/sandstone')) {
				fs.mkdirSync('performance/' + dir + '/sandstone', {recursive: true});
			}
		} else if (theme === 'agate') {
			if (!fs.existsSync('performance/' + dir) || !fs.existsSync('performance/' + dir + '/agate')) {
				fs.mkdirSync('performance/' + dir + '/agate', {recursive: true});
			}
		}

		let txtPath;
		if (theme === 'sandstone') {
			txtPath = path.join(__dirname, 'testResults/sandstone', `${component}.txt`); // eslint-disable-line
		} else if (theme === 'agate') {
			txtPath = path.join(__dirname, 'testResults/agate', `${component}.txt`); // eslint-disable-line
		}

		fs.access(txtPath, fs.F_OK, (err) => {
			if (err) {
				fs.writeFileSync(txtPath, '');
			}
		});
	}
};
