const {TestEnvironment: JSDOMEnvironment} = require('jest-environment-jsdom');

class JSDOMEnvironmentExtended extends JSDOMEnvironment {
	constructor (...args) {
		super(...args);

		this.global.ReadableStream = global.ReadableStream || ReadableStream;
		this.global.TextDecoder = global.TextDecoder || TextDecoder;
		this.global.TextEncoder = global.TextEncoder || TextEncoder;

		this.global.Blob = global.Blob || Blob;
		this.global.Headers = global.Headers || Headers;
		this.global.FormData = global.FormData || FormData;
		this.global.Request = global.Request || Request;
		this.global.Response = global.Response || Response;

		// optional fetch polyfill if not defined
		if (typeof this.global.fetch === 'undefined') {
			this.global.fetch = fetch;
		}

		if (typeof this.global.structuredClone === 'undefined') {
			this.global.structuredClone = structuredClone;
		}
	}
}

module.exports = JSDOMEnvironmentExtended;
