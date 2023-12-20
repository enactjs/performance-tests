const shell = require('shelljs');

// parse --target and --theme command line arguments
const targetEnvArg = process.argv.filter(x => x.startsWith('--target'))[0];
const themeEnvArg = process.argv.filter(x => x.startsWith('--theme'))[0];

// set default value --target=PC and --theme=sandstone
const target = targetEnvArg ? targetEnvArg.split('=')[1] : 'PC';
const theme = themeEnvArg ? themeEnvArg.split('=')[1] : 'sandstone';

if (!shell.which('enact')) {
	errorExit('Sorry, this script requires the enact cli tool');
}

// Run serve command
shell.exec(`npm run serve-${theme}`, {async: true});

// Run wait-on command
shell.exec(`wait-on http://localhost:8080/ && npm test -- --target=${target} --theme=${theme}`, {async: true}, () => {
	// Run stop command after running tests
	shell.exec('npm stop');
});

function errorExit(message, code = 1) {
	console.error(message);
	process.exit(code);
}
