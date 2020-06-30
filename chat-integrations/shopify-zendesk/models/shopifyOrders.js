'use strict'
const mongoose = require('mongoose')
const Orders = new mongoose.Schema({
  customer_id: {
    type: String
  },
  order_id: {
    type: String,
    required: true
  },
  order_number: {
    type: Number
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  total_price: {
    type: String
  },
  billing_address: {
    type: Object
  },
  status: {
    type: String
  }
})

module.exports = mongoose.model('orders', Orders)
