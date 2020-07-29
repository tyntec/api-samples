const dotenv = require("dotenv");

dotenv.config();

const appConfig = {
  PORT: process.env.PORT || 3000,
  WABA_NUMBER: process.env.WABA_NUMBER,
  WATSON_API_KEY: process.env.WATSON_API_KEY,
  CMD_API_KEY: process.env.CMD_API_KEY,
  WATSON_URL: process.env.WATSON_URL,
  ASSISTANT_ID: process.env.ASSISTANT_ID
};

module.exports = appConfig;
