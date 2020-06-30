'use strict'

const Shopify = require('./shopify')
const Zendesk = require('./zendesk')

module.exports = (app) => {
  app.use('/shopify', Shopify)
  app.use('/zendesk', Zendesk)
}
