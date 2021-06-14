const axios = require("axios");
const { appConfig } = require('../config/appConfig');

module.exports = async (numbers, meetingUrl) => {
  const tyntecApiHeaders = { 
    headers: { 
      apikey: appConfig.tyntecApikey,
      "Content-Type": "application/json" 
    }
  }

  try {
    for (const number of numbers) {
      const messageData = {
        from: appConfig.waba,
        to: number,
        channel: 'whatsapp',
        content: {
          contentType: 'template',
          template: {
            templateId: appConfig.templateId,
            templateLanguage: appConfig.templateLanguage,
            components: {
              body: [{
                type: 'text',
                text: meetingUrl,
              }]
            },
          },
        }
      };
      
      await axios.post(
        appConfig.tyntecBaseUrl,
        messageData,
        tyntecApiHeaders
      );
    }

  } catch (e) {
    console.error("Error sending message: ", e);
  }
};