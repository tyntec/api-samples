'use strict'
const Axios = require('axios')
const appConfig = require('../config');
const headers = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + appConfig.CMD_API_KEY
}
const jidTail = '@viber.eazy.im'
const channelJid = appConfig.VIBER_SERVICE_ID + jidTail
const re = /[+ ]/g

// POST https://api.cmd.tyntec.com/v3/channels/{channelJid}/contacts/{contactJid}/notes
//
// {
//     'body': 'Customer number #63553',
//     'referenceId': '<custom idetifier>'
// }
async function viberNoteZendesk (data) {
  console.log(data, 'inside Viber Zendesk')
  console.log('Create note (Zendesk ticket) in Viber channel ' + data.phone.replace(re, ''))
  const contactJid = data.phone.replace(re, '') + jidTail
  const url = `https://api.cmd.tyntec.com/v3/channels/${channelJid}/contacts/${contactJid}/notes`
  const inputBody = {
    body: `<strong>Zendesk</strong><br>Ticket <a href='https://${data.ticket_url}'>#${data.ticket_id}</a> is ${data.status}`
  }
  const response = await Axios.post(url, inputBody, { headers })
  return response.body
};

async function viberNoteShopify(data) {
	console.log(data, 'inside Viber Shopify');
	console.log(
		'Create note (Shopify order) in Viber channel ' + data.phone.replace(re, '')
	);
	const contactJid = data.phone.replace(re, '') + jidTail;
	const url = `https://api.cmd.tyntec.com/v3/channels/${channelJid}/contacts/${contactJid}/notes`;
	const inputBody = {
		body: `<strong>Shopify</strong><br>Order <a href='https://${appConfig.SHOPIFY_DOMAIN}/admin/orders/${data.order_id}'>#${data.order_number}</a> placed`,
	};
	const response = await Axios.post(url, inputBody, { headers });
	return response.body;
};

module.exports = {
  viberNoteZendesk,
  viberNoteShopify
}
