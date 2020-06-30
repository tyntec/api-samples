'use strict'
const Mongoose = require('mongoose')
const TicketSchema = Mongoose.Schema({
  ticket_id: {
    type: Number,
    unique: true
  },
  ticket_url: {
    type: String
  },
  order_number: {
    type: String
  },
  status: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  tags: {
    type: Array
  }
})

module.exports = Mongoose.model('tickets', TicketSchema)
