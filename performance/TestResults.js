require('dotenv').config();
const  fs = require('fs');
const path = require('path');
const fetchAPI = (...args) => import('node-fetch').then(({default: fetchData}) => fetchData(...args));

const {version: ReactVersion} = require('react/package.json');
const {version: EnactVersion} = require('@enact/core/package.json');
const {version: SandstoneVersion} = require('@enact/sandstone/package.json');
const {version: AgateVersion} = require('@enact/agate/package.json');

const API_URL = process.env.API_URL;

const TestResult = module.exports = {
	results: [],
	addResult: ({component, type, actualValue}) => {
		const timestamp = Date.now();
		const result = process.env.REACT_APP_AGATE ?
			{ReactVersion, EnactVersion, AgateVersion, timestamp, component, type, actualValue} :
			{ReactVersion, EnactVersion, SandstoneVersion, timestamp, component, type, actualValue}
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
			const txtPath = process.env.REACT_APP_AGATE ?
				path.join(__dirname, 'testResults/agate', `${component}.txt`) : // eslint-disable-line
				path.join(__dirname, 'testResults/sandstone', `${component}.txt`); // eslint-disable-line

			fs.appendFileSync(txtPath, JSON.stringify(result) + '\n');
		}
	},
	newFile: (component) => {
		const dir = process.env.REACT_APP_AGATE ? 'testResults/agate' : 'testResults/sandstone'

		if (!fs.existsSync('performance/' + dir)) {
			fs.mkdirSync('performance/' + dir);
		}
		const txtPath = path.join(__dirname, dir, `${component}.txt`); // eslint-disable-line

		fs.access(txtPath, fs.F_OK, (err) => {
			if (err) {
				fs.writeFileSync(txtPath, '');
			}
		});
	}
};
