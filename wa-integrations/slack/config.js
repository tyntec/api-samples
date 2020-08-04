const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const appConfig = {
  PORT: process.env.PORT || 3000,
  WABA: process.env.WABA_NUMBER,
  TYNTEC_API: process.env.TYNTEC_API_KEY,
  SLACK_BOT: process.env.SLACK_BOT_TOKEN,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/tyntec',
  RESET_TOKEN: process.env.RESET_TOKEN || uuidv4(),
};

module.exports = appConfig;
