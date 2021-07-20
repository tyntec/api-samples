const axios = require('axios');
const appConfig = require('../config');
const openid = require('openid-client');

const redirect_uri = `${appConfig.BASE_URL}/oauth/redirect`;

class Client {
  constructor() {
    this.axios = axios.create();
    this.openidClient = this.getOpenidClient();
    this.refreshToken = null;
  }

  setAccountsUrl(accountsUrl) {
    this.openidClient = this.getOpenidClient(accountsUrl);
  }

  authorizationUrl() {
    return this.openidClient.authorizationUrl({
      access_type: 'offline',
      redirect_uri,
      scope: 'ZohoCRM.modules.contacts.READ,ZohoCRM.modules.contacts.UPDATE'
    });
  }

  callbackParams(input) {
    return this.openidClient.callbackParams(input);
  }

  async generateTokensFromCallback(params) {
    const tokenSet = await this.openidClient.oauthCallback(redirect_uri, params);
    this.refreshToken = tokenSet.refresh_token;
  }

  async getContactDetails(phone) {
    const response = await this.requestApi('get', '/crm/v2.1/Contacts/search', { params: { phone }});
    return response.data.data[0];
  }

  async updateContactDetails(contactId, remarks) {
    const [Email, Mailing_City, Mailing_Country] = remarks.toString().split('<br>');
    await this.requestApi('put', `/crm/v2.1/Contacts/${contactId}`, { data: {
      data: [{
        Email,
        Mailing_City,
        Mailing_Country
      }]
    }});
  }

  getOpenidClient(accountsUrl) {
    const issuer = new openid.Issuer({
      authorization_endpoint: 'https://accounts.zoho.com/oauth/v2/auth',
      token_endpoint: `${accountsUrl}/oauth/v2/token`
    });
    return new issuer.Client({
      client_id: appConfig.ZOHO_CLIENT_ID,
      client_secret: appConfig.ZOHO_CLIENT_SECRET
    });
  }

  async requestApi(method, url, opts) {
    const tokenSet = await this.openidClient.refresh(this.refreshToken);

    const config = {
      method,
      baseURL: tokenSet.api_domain,
      url,
      headers: {
        Authorization: `Zoho-oauthtoken ${tokenSet.access_token}`,
      },
    };
    if (opts !== undefined && opts.params !== undefined) {
      config.params = opts.params;
    }
    if (opts !== undefined && opts.data !== undefined) {
      config.data = opts.data;
    }

    return await this.axios.request(config);
  }
}

module.exports = {
  client: new Client()
};