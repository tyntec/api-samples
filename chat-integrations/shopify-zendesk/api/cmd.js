'use strict';

const Axios = require('axios');
const appConfig = require('../config');
const headers = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + appConfig.CMD_API_KEY
};

const channelJidWhatsapp = appConfig.WABA_NUMBER + '@whatsapp.eazy.im';
const channelJidViber = appConfig.VIBER_SERVICE_ID + '@viber.eazy.im';
const re = /[+ ]/g;

// POST https://api.cmd.tyntec.com/v3/channels/{channelJid}/contacts/{contactJid}/notes
//
// {
//     'body': 'Customer number #63553',
//     'referenceId': 'CUSTOMER_NUMBER'
// }

async function createNote(channel, channelJid, data, service) {
  console.log(data, `inside ${channel} ${service}`);
  console.log(`Create note (${service} ticket) in ${channel} channel ` + data.phone.replace(re, ''));

  const channelTag = channel === 'whatsapp' ? '@whatsapp.eazy.im' : '@viber.eazy.im';
  const contactJid = data.phone.replace(re, '') + channelTag;
  const url = `https://api.cmd.tyntec.com/v3/channels/${channelJid}/contacts/${contactJid}/notes`;

  const inputBody = {
    body: service === 'zendesk' ?
      `<strong>Zendesk</strong><br>Ticket <a href='https://${data.ticket_url}'>#${data.ticket_id}</a> is ${data.status}` :
      `<strong>Shopify</strong><br>Order <a href='https://${appConfig.SHOPIFY_DOMAIN}/admin/orders/${data.order_id}'>#${data.order_number}</a> placed`
  };

  const response = await Axios.post(url, inputBody, { headers });
  return response.body;
}

async function newNote(data, service) {
  if (appConfig.CHANNEL === 'whatsapp') {
    return await createNote('whatsapp', channelJidWhatsapp, data, service);
  } else if (appConfig.CHANNEL === 'viber') {
    return await createNote('viber', channelJidViber, data, service);
  } else {
    const results = await Promise.allSettled([
      createNote('whatsapp', channelJidWhatsapp, data, service),
      createNote('viber', channelJidViber, data, service)
    ]);
    return results.forEach(result => result.value ? result.value : result.reason);
  }
};

module.exports = {
  newNote
};
