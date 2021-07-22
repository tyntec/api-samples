const dotenv = require('dotenv');

dotenv.config();

const appConfig = {
  WABA_NUMBER: process.env.WABA_NUMBER,
  CMD_API_KEY: process.env.CMD_API_KEY,
  MONGO_URL: process.env.MONGO_URL  || 'mongodb://127.0.0.1:27017',
  PORT: process.env.PORT || 3000,
  SHOPIFY_DOMAIN: process.env.SHOPIFY_DOMAIN,
  CHANNEL: process.env.CHANNEL,
  VIBER_SERVICE_ID: process.env.VIBER_SERVICE_ID,
};

module.exports = appConfig;