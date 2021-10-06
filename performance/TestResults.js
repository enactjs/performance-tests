require('dotenv').config();
const  fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const {version: ReactVersion} = require('react/package.json');
const {version: EnactVersion} = require('@enact/core/package.json');
// eslint-disable-next-line no-undef
const API_URL = process.env.API_URL;

const TestResult = module.exports = {
	results: [],
	addResult: ({component, type, actualValue}) => {
		const timestamp = Date.now();
		const result = {ReactVersion, EnactVersion, timestamp, component, type, actualValue};
		TestResult.results.push(result);
		// batch this in the future
		if (API_URL) {
			fetch(API_URL, {
				method: 'POST',
				body: JSON.stringify(result),
				headers: {'Content-Type': 'application/json'}}
			)
				.then(res => console.log(res.json()))
				.catch(err => console.log(err));
		} else {
			console.log(result);
			const txtPath = path.join(__dirname, 'testResults', `${component}.txt`);

		 	fs.appendFileSync(txtPath, JSON.stringify(result) + '\n');
		}
	},
	getResults: () => {
		return TestResult.results;
	},
	emptyFile: (component) => {
		const txtPath = path.join(__dirname, 'testResults', `${component}.txt`);

		fs.access(txtPath, fs.F_OK, (err) => {
			if (err) {
				fs.writeFileSync(txtPath, '');
			}
		})
	}
};
