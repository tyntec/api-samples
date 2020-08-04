const axios = require('axios');
const appConfig = require('../config');
const querystring = require('querystring');

async function getZohoContactDetails(mobileNumber) {
  try {
    const phonenumber = querystring.stringify({
      phonenumber: mobileNumber
    });
    const URL = `${appConfig.ZOHO_GET_FUNCTION_URL}&${phonenumber}`;
    await axios.default.get(URL);
    //should return some 200
  } catch (e) {
    throw new Error(`Unable to fetch Zoho Contacts on: ${e}`);
  }
}

async function updateZohoContactDetails(phonenumber, remarks) {
  try {
    const [email, city, country] = remarks.toString().split('<br>');
    const query = querystring.stringify({
      email,
      city,
      country
    });
    const phone = querystring.stringify({
      phonenumber
    });
    let URL = `${appConfig.ZOHO_UPDATE_FUNCTION_URL}&${phone}&${query}`;
    await axios.default.get(URL);
  } catch (e) {
    throw new Error(`Unable to fetch Zoho Contacts on: ${e}`);
  }
}
module.exports = {
  getZohoContactDetails,
  updateZohoContactDetails
};