/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
require('dotenv').config();
const  fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const {version: ReactVersion} = require('react/package.json');
const {version: EnactVersion} = require('@enact/core/package.json');
const {version: SandstoneVersion} = require('@enact/sandstone/package.json');
// eslint-disable-next-line no-undef
const API_URL = process.env.API_URL;

const TestResult = module.exports = {
	results: [],
	addResult: ({component, type, actualValue}) => {
		const timestamp = Date.now();
		const result = {ReactVersion, EnactVersion, SandstoneVersion, timestamp, component, type, actualValue};
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
	newFile: (component) => {
		const dir = 'testResults';

		if (!fs.existsSync('performance/' + dir)) {
			fs.mkdirSync('performance/' + dir);
		}
		const txtPath = path.join(__dirname, dir, `${component}.txt`);

		fs.access(txtPath, fs.F_OK, (err) => {
			if (err) {
				fs.writeFileSync(txtPath, '');
			}
		});
	}
};
