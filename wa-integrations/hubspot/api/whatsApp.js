const Axios = require('axios')
const handleError = require('./../errorHandler.js').handleError

const channelJid = process.env.WABA_NUMBER + '@whatsapp.eazy.im'

exports.sendWelcomeMessage = async (to, firstname) => {
  console.log('WA sendWelcomeMessage: ', to, firstname)
  const url = 'https://api.eazy.im/v3/channels/' + channelJid + '/messages/' + to + '@whatsapp.eazy.im'
  const config = {
    headers: {
      Authorization: 'Bearer ' + process.env.EAZY_API_KEY,
      'Content-Type': 'application/json'
    }
  }
  const body = {
    message: {
      body: `Hello ${firstname}, nice to have you in our platform. A warm welcome from our team.`,
      type: 'text'
    }
  }
  try {
    const result = await Axios.post(url, body, config)
    console.log('WA Message sent, ID:', result.data.id)
  } catch (e) {
    handleError(e)
  }
}
