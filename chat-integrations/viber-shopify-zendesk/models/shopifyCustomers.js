'use strict'
const mongoose = require('mongoose')
const ShopifyCustomers = new mongoose.Schema({
  customer_id: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  phone: {
    type: String
  },
  tags: {
    type: String
  },
  address: {
    type: Array
  }
})

module.exports = mongoose.model('customers', ShopifyCustomers)
