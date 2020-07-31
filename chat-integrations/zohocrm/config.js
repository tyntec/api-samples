const dotenv = require('dotenv');

dotenv.config();

const appConfig = {
	PORT: process.env.PORT || 3000,
	CMD_API_KEY: process.env.CMD_API_KEY,
	ZOHO_GET_FUNCTION_URL: process.env.ZOHO_GET_FUNCTION_URL,
	ZOHO_UPDATE_FUNCTION_URL: process.env.ZOHO_UPDATE_FUNCTION_URL,
	ZOHO_ORG_URL: process.env.ZOHO_ORG_URL,
	CMD_CHANNEL_JID: `${process.env.WABA_NUMBER}@whatsapp.eazy.im`,
};

module.exports = appConfig;
