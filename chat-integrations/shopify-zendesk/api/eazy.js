'use strict'

const Axios = require('axios')

const headers = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + process.env.EAZY_API_KEY
}
const jidTail = '@whatsapp.eazy.im'
const channelJid = process.env.WABA_NUMBER + jidTail
const re = /[+ ]/g

// POST https://api.eazy.im/v3/channels/{channelJid}/contacts/{contactJid}/notes
//
// {
//     'body': 'Customer number #63553',
//     'referenceId': 'CUSTOMER_NUMBER'
// }
async function whatsAppNoteZendesk (data) {
  console.log(data, 'inside WA Zendesk')
  console.log('Create note (Zendesk ticket) in WA channel ' + data.phone.replace(re, ''))
  const contactJid = data.phone.replace(re, '') + jidTail
  const url = `https://api.eazy.im/v3/channels/${channelJid}/contacts/${contactJid}/notes`
  const inputBody = {
    body: `<strong>Zendesk</strong><br>Ticket <a href='https://${data.ticket_url}'>#${data.ticket_id}</a> is ${data.status}`
  }
  const response = await Axios.post(url, inputBody, { headers })
  return response.body
};

async function whatsAppNoteShopify (data) {
  console.log(data, 'inside WA Shopify')
  console.log('Create note (Shopify order) in WA channel ' + data.phone.replace(re, ''))
  const contactJid = data.phone.replace(re, '') + jidTail
  const url = `https://api.eazy.im/v3/channels/${channelJid}/contacts/${contactJid}/notes`
  const inputBody = {
    body: `<strong>Shopify</strong><br>Order <a href='https://${process.env.SHOPIFY_DOMAIN}/admin/orders/${data.order_id}'>#${data.order_number}</a> placed`
  }
  const response = await Axios.post(url, inputBody, { headers })
  return response.body
};

module.exports = {
  whatsAppNoteZendesk,
  whatsAppNoteShopify
}
