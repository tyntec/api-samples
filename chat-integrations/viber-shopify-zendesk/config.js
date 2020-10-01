const dotenv = require('dotenv');

dotenv.config();

const appConfig = {
    PORT: process.env.PORT || 3000,
    MONGO_URL : process.env.MONGO_URL || "mongodb://127.0.0.1:27017",
    CMD_API_KEY :process.env.CMD_API_KEY ,
    VIBER_SERVICE_ID :process.env.VIBER_SERVICE_ID ,
    SHOPIFY_DOMAIN: process.env.SHOPIFY_DOMAIN
 
};

module.exports = appConfig;
