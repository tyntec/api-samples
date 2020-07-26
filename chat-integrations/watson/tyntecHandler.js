"use strict";
const axios = require("axios");
const appConfig = require("./config");

exports.sendMessageToWhatsapp = async (to, text) => {
  const channelJid = appConfig.WABA_NUMBER + "@whatsapp.eazy.im";

  console.log(
    `sendMessageToWhatsapp- from ${channelJid} -to ${to} text--- ${text}`
  );

  const url = `https://api.eazy.im/v3/channels/${channelJid}/messages/${to}`;
  const headers = {
    "content-type": "application/json",
    Authorization: "Bearer " + appConfig.EAZY_API_KEY
  };
  const data = {
    message: {
      body: text,
      type: "text"
    }
  };

  return axios.post(url, data, {
    headers: headers
  });
};
