const Router = require('express').Router();
const Channel = require('../models/slackChannels');
const Contact = require('../models/contacts');

const appConfig = require('../config');

Router.post('/', async function(req, resp) {
    if (appConfig.RESET_TOKEN != req.headers['x-reset-token']) {        
        resp.status(401).send('Unauthorized');
        return;
    } 
    Channel.deleteMany({}, function(err) {
      console.log(err);
    })
  
    Contact.deleteMany({}, function (err) {
      console.log(err);
    })
    resp.status(200).send('ok');
  })
  module.exports = Router;
