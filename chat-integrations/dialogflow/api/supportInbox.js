const axios = require('axios');
const { appConfig } = require('../config/appConfig');

const sendWhatsappTextMessage = async (params) => {
  const request = {
    message: {
      body: params.text,
      type: "text"
  }
  };
  return axios.post(`${appConfig.tyntecBaseUrl}/channels/${params.to}@whatsapp.eazy.im/messages/${params.from}@whatsapp.eazy.im`, request, { headers: { Authorization: 'Bearer ' + appConfig.tyntecApikey } });
};

const sendWhatsappImage = async (params) => {
  const request = {
    message: {
      url: params.media.url,
      type:	"image",
  //  caption:"" Caption text message
  }
  };
  return axios.post(`${appConfig.tyntecBaseUrl}/channels/${params.to}@whatsapp.eazy.im/messages/${params.from}@whatsapp.eazy.im`, request, { headers: { Authorization: 'Bearer ' + appConfig.tyntecApikey } });
};


module.exports = {
  sendWhatsappTextMessage,
  sendWhatsappImage,
};
