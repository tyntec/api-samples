'use strict';

const Slack = require('./slack');
const Whatsapp = require('./whatsapp');

module.exports = (app) => {
  app.use('/tyntec', Whatsapp);
  app.use('/slack', Slack);
};
