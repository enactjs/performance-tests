module.exports = require('@enact/ui-test-utils/performance/wdio.conf.js');
const {ipAddress} = require('./performance/utils');

global.serverAddr = `${ipAddress()}:8080`;