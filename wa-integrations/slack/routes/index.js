'use strict';

const Slack = require('./slack');
const Whatsapp = require('./whatsapp');
const Management = require('./management');

module.exports = (app) => {
  app.use('/tyntec', Whatsapp);
  app.use('/slack', Slack);
  app.use('/resetAll', Management);
};
