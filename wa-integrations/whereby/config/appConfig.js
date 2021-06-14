const dotenv = require('dotenv');

dotenv.config();

const appConfig = {
  port: process.env.PORT || 3000,
  tyntecApikey: process.env.TYNTEC_API_KEY,
  tyntecBaseUrl: process.env.TYNTEC_BASE_URL,
  wherebyApiKey: process.env.WHEREBY_API_KEY,
  waba: process.env.WABA_NUMBER,
  templateId:process.env.TEMPLATE_ID,
  templateLanguage:process.env.TEMPLATE_LANGUAGE
};

module.exports = {
  appConfig,
};
