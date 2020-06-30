'use strict'
const Router = require('express').Router()
// const Axios = require('axios')
const ZendeskCtrl = require('../controllers/zendesk')

// Ticket routes
Router.route('/createTicket').post(async (req, res) => {
  try {
    console.log('--- route: Zendesk create ticket', req.body)
    const obj = {
      ticket_id: req.body.id,
      ticket_url: req.body.url,
      status: req.body.status,
      order_number: req.body.order_number,
      phone: req.body.phone,
      email: req.body.email
    }
    const result = await ZendeskCtrl.createTicket(obj)
    console.log(req.body)
    res.status(200).send(result)
  } catch (e) {
    console.log(e)
  }
})

Router.route('/updateStatus').post(async (req, res) => {
  try {
    console.log('--- route: Zendesk update ticket status', req.body)
    const result = await ZendeskCtrl.updateTicketStatus(
      req.body.id,
      req.body.status
    )
    res.status(201).send(result)
  } catch (e) {
    console.log(e)
  }
})

module.exports = Router
