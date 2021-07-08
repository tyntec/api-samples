'use strict'

const ShopifyOrders = require('../models/shopifyOrders')
const ShopifyCustomers = require('../models/shopifyCustomers')
const CMD = require('../api/cmd')
const handleError = require('../errorHandler').handleError

async function createCustomer (data) {
  try {
    const newCustomer = new ShopifyCustomers(data)
    const res = await newCustomer.save()
    return res
  } catch (e) {
    console.log(e)
  }
}

async function updateCustomer (id, newData) {
  try {
    const res = await ShopifyCustomers.findOneAndUpdate(
      { customer_id: id },
      { $set: newData },
      { new: true }
    )
    console.log(res)
    return res
  } catch (e) {
    console.log(e)
  }
}

async function getCustomerByID (id) {
  try {
    const res = await ShopifyCustomers.findOne({ customer_id: id })
    console.log(res)
    return res
  } catch (e) {
    console.log(e)
  }
}

// Order related APIs
async function createOrder (data) {
  try {
    const newOrder = new ShopifyOrders(data)
    const res = await newOrder.save()
    if (!res.phone) {
      const result = await ShopifyCustomers.findOne({
        customer_id: res.customer_id
      })
      res.phone = result.phone
    }
    if (res) {
      await CMD.newNote(res, 'shopify')
    }
    return res
  } catch (e) {
    handleError(e)
  }
}

async function updateOrder (id, newData) {
  try {
    const res = await ShopifyOrders.findOneAndUpdate(
      { order_id: id },
      { $set: newData },
      { new: true }
    )
    console.log(res)
    return res
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  createCustomer,
  updateCustomer,
  createOrder,
  updateOrder,
  getCustomerByID
}
