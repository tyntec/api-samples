'use strict';
const appConfig = require('./config');
const cache = require('./cacheState');
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

const assistant = new AssistantV2({
	version: '2020-02-05',
	authenticator: new IamAuthenticator({
		apikey: appConfig.WATSON_API_KEY,
	}),
	url: appConfig.WATSON_URL,
	disableSslVerification: true,
});

// Create a session and use the session id while sending the text to watson assistant
async function createSession() {
	const res = await assistant.createSession({
		assistantId: appConfig.ASSISTANT_ID,
	});
	return res.result.session_id;
}

// Send the text to watson and get a response
async function sendTextToWatson(text) {
	try {
		const sessionId = cache.getCurrentSession();
		if (!sessionId) {
			throw new Error('Session ID is undefined!');
		}
		const res = await assistant.message({
			assistantId: appConfig.ASSISTANT_ID,
			sessionId: sessionId,
			input: {
				message_type: 'text',
				text: text,
			},
		});
		return res.result.output.generic[0].text;
	} catch (err) {
		console.error(`Error: ${err}`);
	}
}
module.exports = {
	createSession,
	sendTextToWatson,
};
