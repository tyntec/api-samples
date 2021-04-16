const Qs = require('qs')
const Axios = require('axios')
const handleError = require('./../errorHandler.js').handleError

var hubspotRefreshToken

// Handle app authorization
exports.handleAuth = async (req, res) => {
  const code = req.query.code
  console.log('HS Auth: Received auth code')
  const url = 'https://api.hubapi.com/oauth/v1/token'
  const formData = {
    grant_type: 'authorization_code',
    client_id: process.env.HS_CLIENT_ID,
    client_secret: process.env.HS_CLIENT_SECRET,
    redirect_uri: process.env.HS_OAUTH_REDIR,
    code: code
  }
  const config = {
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  try {
    const response = await Axios.post(url, Qs.stringify(formData), config)
    exports.hubspotAccessToken = response.data.access_token
    hubspotRefreshToken = response.data.refresh_token
    console.log('HS Auth: Got the tokens')
    res.status(200).send('Authorization completed.')
  } catch (e) {
    handleError(e)
    res.status(500).send('Something went wrong, see log.')
  }
}

// Check that access token is still up to date or refresh it
exports.updateAccessToken = async () => {
  try {
    let response = await Axios.get('https://api.hubapi.com/oauth/v1/access-tokens/' + exports.hubspotAccessToken)
    const expires = response.data.expires_in
    console.log('HS Access token expires in', expires)
    if (expires <= 60) {
      const url = 'https://api.hubapi.com/oauth/v1/token'
      const formData = {
        grant_type: 'refresh_token',
        client_id: process.env.HS_CLIENT_ID,
        client_secret: process.env.HS_CLIENT_SECRET,
        refresh_token: hubspotRefreshToken
      }
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      response = await Axios.post(url, Qs.stringify(formData), config)
      exports.hubspotAccessToken = response.data.access_token
      console.log('HS Refreshed the access token')
    }
  } catch (e) {
    handleError(e)
  }
}

// Create a new contact in HubSpot CRM, if it doesn't exist
exports.handleHubspotContact = async (req) => {
  this.updateAccessToken()
  if (req.body.from.jid) {
    const phone = req.body.from.jid.replace('@whatsapp.eazy.im', '')
    const config = {
      headers: {
        Authorization: `Bearer ${exports.hubspotAccessToken}`,
        'Content-Type': 'application/json'
      }
    }
    // Check whether the contact already exists in the HubSpot
    try {
      const contactInfo = await Axios.post('https://api.hubapi.com/crm/v3/objects/contacts/search', { query: phone }, config)
      if (contactInfo.data.results.length) {
        console.log('HS Contact already exists')
      } else {
        const contact = {
          properties: {
            firstname: req.body.from.name,
            phone: phone,
            origin: true
          }
        }
        await Axios.post('https://api.hubapi.com/crm/v3/objects/contacts', contact, config)
        console.log('HS New contact created')
      }
    } catch (e) {
      handleError(e)
    }
  }
}
