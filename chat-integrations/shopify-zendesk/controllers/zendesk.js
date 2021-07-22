'use strict'
const Zendesk = require('../models/zendesk')
// const Axios = require('axios')
const CMD = require('../api/cmd')
const handleError = require('../errorHandler').handleError

async function createTicket (data) {
  try {
    const newTicket = new Zendesk(data)
    const res = await newTicket.save()
    if (res) {
      await CMD.newNote(res, 'zendesk')
    }
    return res
  } catch (e) {
    handleError(e)
  }
}

async function updateTicket (id, newData) {
  try {
    const res = await Zendesk.findOneAndUpdate(
      { ticket_id: id },
      { $set: newData },
      { new: true }
    )
    console.log(res)
    return res
  } catch (e) {
    console.log(e)
  }
}

async function updateTicketStatus (id, status) {
  try {
    const res = await Zendesk.findByIdAndUpdate(
      { ticket_id: id },
      { $set: { status: status } }
    )
    return res
  } catch (e) {
    console.log(e, 'on controllers/zendesk.js on line 37')
  }
}

module.exports = {
  createTicket,
  updateTicket,
  updateTicketStatus
}
