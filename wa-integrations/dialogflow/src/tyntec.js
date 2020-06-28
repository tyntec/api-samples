const axios = require('axios');
const config = require('../config.json');

const sendWhatsappTextMessage = async params => {
  const request = {
    to: params.to,
    channels: ['whatsapp'],
    whatsapp: {
      from: params.from,
      contentType: 'text',
      text: params.text,
    },
  };

  return axios.post(`${config.tyntecBaseUrl}/messages`, request, { headers: { apikey: config.tyntecApikey } });
}

const sendWhatsappImage = async params => {
  const request = {
    to: params.to,
    channels: ['whatsapp'],
    whatsapp: {
      from: params.from,
      contentType: 'media',
      media: params.media,
    },
  };

  return axios.post(`${config.tyntecBaseUrl}/messages`, request, { headers: { apikey: config.tyntecApikey } });
}

module.exports = {
  sendWhatsappTextMessage,
  sendWhatsappImage,
};
