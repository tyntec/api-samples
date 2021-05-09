const axios = require('axios');
const { appConfig } = require('../config/appConfig');

const sendWhatsappTextMessage = async (params) => {
  const request = {
    to: params.to,
    from: params.from,
    channel : "whatsapp",
    content: {     
      contentType: 'text',
      text: params.text,
    },
  };

  return axios.post(`${appConfig.tyntecBaseUrl}/messages`, request, { headers: { apikey: appConfig.tyntecApikey } });
};

const sendWhatsappImage = async (params) => {
  const request = {
    to: params.to,
    from: params.from,
    channel: 'whatsapp',
    content: { 
      contentType: 'image',
      image: {
        url: params.media.url, 
        caption: params.media.caption
        //caption : "An optional caption"
      }
    },
  };

  return axios.post(`${appConfig.tyntecBaseUrl}/messages`, request, { headers: { apikey: appConfig.tyntecApikey } });
};

module.exports = {
  sendWhatsappTextMessage,
  sendWhatsappImage,
};
