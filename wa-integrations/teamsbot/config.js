const dotenv = require('dotenv');
dotenv.config();

const appConfig = {
  PORT: process.env.PORT || 3000,
  MICROSOFT_BOT_ID: process.env.MICROSOFT_BOT_ID,
  MICROSOFT_BOT_PASSWORD: process.env.MICROSOFT_BOT_PASSWORD,
  TYNTEC_WABA_NUMBER: process.env.TYNTEC_WABA_NUMBER,
  TYNTEC_API_KEY: process.env.TYNTEC_API_KEY,
};

module.exports = appConfig;
