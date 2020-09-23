'use strict';
const axios = require('axios');
const appConfig = require('./config');

exports.sendMessageToWhatsapp = async (to, text) => {
	const channelJid = appConfig.WABA_NUMBER + '@whatsapp.eazy.im';

	console.log(
		`sendMessageToWhatsapp- from ${channelJid} -to ${to} text--- ${text}`
	);

	const url = `https://api.cmd.tyntec.com/v3/channels/${channelJid}/messages/${to}`;
	const headers = {
		'content-type': 'application/json',
		Authorization: 'Bearer ' + appConfig.CMD_API_KEY,
	};
	const data = {
		message: {
			body: text,
			type: 'text',
		},
	};
	axios
		.post(url, data, {
			headers: headers,
		})
		.catch((err) => console.log(err.response.status, err.response.statusText));
};
