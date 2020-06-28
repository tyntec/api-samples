const Axios = require('axios')
const BodyParser = require('body-parser')
const Express = require('express')
const WhatsApp = require('./api/whatsApp')
const HubspotHandler = require('./api/hubspotHandler')
const handleError = require('./errorHandler.js').handleError

const app = Express()

app.use(BodyParser.urlencoded({ extended: false }))
app.use(BodyParser.json())

// Generates the link for app installation in HubSpot
app.get('/', (req, res) => {
  if (process.env.HS_CLIENT_ID && process.env.HS_OAUTH_REDIR) {
    res.status(200).send('<a href="https://app.hubspot.com/oauth/authorize?client_id=' +
      process.env.HS_CLIENT_ID + '&scope=contacts%20oauth&redirect_uri=' +
      process.env.HS_OAUTH_REDIR + '">Install your app in HubSpot</a>')
  } else {
    res.status(400).send('HubSpot App Client ID or Redirect URI unknown.')
  }
})

// App authorization completion during installation in HubSpot
app.get('/auth', HubspotHandler.handleAuth)

// This will be triggered when a WhatsApp message is received
app.post('/whatsAppTrigger', async (req, res) => {
  try {
    await HubspotHandler.handleHubspotContact(req)
    res.sendStatus(204)
  } catch (error) {
    console.log('Error in HubspotHandler', error)
    res.sendStatus(500)
  }
})

// This will be triggered when a contact is created in HubSpot CRM
app.post('/contactCreated', async (req, res) => {
  try {
    console.log('Contact created: ', req.body[0].objectId)
    HubspotHandler.updateAccessToken()
    const url = 'https://api.hubapi.com/crm/v3/objects/contacts/' + req.body[0].objectId +
      '?properties=firstname,phone,origin'
    const config = {
      headers: {
        Authorization: `Bearer ${HubspotHandler.hubspotAccessToken}`,
        'Content-Type': 'application/json'
      }
    }
    const response = await Axios.get(url, config)
    if (response.data.properties.origin) {
      console.log('From WhatsApp:', response.data.properties.origin)
      await WhatsApp.sendWelcomeMessage(response.data.properties.phone, response.data.properties.firstname)
    } else {
      console.log('From WhatsApp: false, nothing done')
    }
    res.sendStatus(204)
  } catch (e) {
    handleError(e)
    res.sendStatus(500)
  }
})

app.listen('3000', () => {
  console.log('Server listening on port 3000')
})
