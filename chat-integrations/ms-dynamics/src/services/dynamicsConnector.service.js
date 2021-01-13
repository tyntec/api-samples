import adal from 'adal-node';
import DynamicsWebApi from 'dynamics-web-api';

export class DynamicsConnector {
  constructor(tenantId, resource, clientId, username, password) {
    this.authorityUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/token`;
    this.resource = `https://${resource}/`;
    this.apiUrl = resource;
    this.clientId = clientId;
    this.username = username;
    this.password = password;

    //create DynamicsWebApi object
    this.dynamicsWebApi = new DynamicsWebApi({
      webApiUrl: `https://${this.apiUrl}/api/data/v9.0/`,
      onTokenRefresh: (cb) => this.acquireTokens(cb),
    });

    this.adalContext = new adal.AuthenticationContext(this.authorityUrl);
  }

  acquireTokens(dynamicsCallback) {
    const adalCallback = (error, token) => {
      if (!error) {
        //call DynamicsWebApi callback only when a token has been retrieved
        dynamicsCallback(token);
      } else {
        console.log('Token has not been retrieved. Error: ' + error.stack);
      }
    };
    this.adalContext.acquireTokenWithUsernamePassword(
      this.resource,
      this.username,
      this.password,
      this.clientId,
      adalCallback
    );
  }
}
