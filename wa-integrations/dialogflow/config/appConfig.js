const dotenv = require('dotenv');

dotenv.config();

const appConfig = {
  port: process.env.PORT,
  debug: process.env.DEBUG,
  tyntecApikey: process.env.TYNTEC_API_KEY,
  tyntecBaseUrl: process.env.TYNTEC_BASE_URL,
  projectId: process.env.PROJECT_ID,
};

module.exports = {
  appConfig,
};
