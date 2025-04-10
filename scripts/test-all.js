const shell = require('shelljs');

// parse --target,--theme and --throttling command line arguments
const targetEnvArg = process.argv.filter(x => x.startsWith('--target'))[0];
const themeEnvArg = process.argv.filter(x => x.startsWith('--theme'))[0];
const throttlingEnvArg = process.argv.filter(x => x.startsWith('--throttling'))[0];

// set default value --target=PC, --theme=limestone and --throttling=1
const target = targetEnvArg ? targetEnvArg.split('=')[1] : 'PC';
const theme = themeEnvArg ? themeEnvArg.split('=')[1] : 'limestone';
const throttling = throttlingEnvArg ? throttlingEnvArg.split('=')[1] : 1;

if (!shell.which('enact')) {
	errorExit('Sorry, this script requires the enact cli tool');
}

// Run pack command and serve app
shell.exec(`npm run pack-p-${theme} && cd dist && serve -l 8080 --no-request-logging`, {async: true});

// Run wait-on command
shell.exec(`wait-on http://localhost:8080/ && npm test -- --target=${target} --theme=${theme} --throttling=${throttling}`, {async: true}, () => {
	// Run stop command after running tests
	shell.exec('npm stop');
});

function errorExit (message, code = 1) {
	console.error(message); // eslint-disable-line no-console
	process.exit(code);
}
