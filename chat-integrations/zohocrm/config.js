const dotenv = require('dotenv');

dotenv.config();

const appConfig = {
	PORT: process.env.PORT || 3000,
	BASE_URL: process.env.BASE_URL,
	CMD_API_KEY: process.env.CMD_API_KEY,
	ZOHO_CLIENT_ID: process.env.ZOHO_CLIENT_ID,
	ZOHO_CLIENT_SECRET: process.env.ZOHO_CLIENT_SECRET,
	ZOHO_ORG_URL: process.env.ZOHO_ORG_URL,
	CMD_CHANNEL_JID: `${process.env.WABA_NUMBER}@whatsapp.eazy.im`,
};

module.exports = appConfig;
