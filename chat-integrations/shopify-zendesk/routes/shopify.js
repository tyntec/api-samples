'use strict'

const Router = require('express').Router()
const ShopifyCtrl = require('../controllers/shopify')

// Customer routes

Router.route('/createCustomer').post(async (req, res) => {
  try {
    console.log('--- route: Shopify createCustomer', req.body)
    const obj = {
      customer_id: req.body.id,
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone: req.body.phone || req.body.default_address.phone,
      tags: req.body.tags,
      address: req.body.addresses
    }
    const data = await ShopifyCtrl.createCustomer(obj)
    res.status(200).send(data)
  } catch (e) {
    console.log(e)
  }
})

Router.route('/updateCustomer').post(async (req, res) => {
  console.log('--- route: Shopify updateCustomer', req.body)
  try {
    const obj = {
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone: req.body.phone || req.body.default_address.phone,
      tags: req.body.tags,
      address: req.body.addresses
    }
    const data = await ShopifyCtrl.updateCustomer(req.body.id, obj)
    res.status(200).send(data)
  } catch (e) {
    console.log(e)
  }
})

// Order routes

Router.route('/createOrder').post(async (req, res) => {
  console.log('--- route: Shopify createOrder')
  if (req.body.email === 'jon@doe.ca') {
    console.log('Testing order received')
    res.sendStatus(204)
    return
  }
  try {
    console.log(req.body)
    const obj = {
      customer_id: req.body.customer.id,
      order_id: req.body.id,
      order_number: req.body.order_number,
      phone: req.body.phone || req.body.billing_address.phone,
      email: req.body.email,
      total_price: req.body.total_price,
      billing_address: req.body.billing_address,
      status: req.body.status
    }
    const data = await ShopifyCtrl.createOrder(obj)
    const customerData = await ShopifyCtrl.getCustomerByID(req.body.customer.id)
    // console.log(customerData)
    if (data.phone && customerData && !customerData.phone) {
      console.log('inside condition')
      const UpdateStatus = await ShopifyCtrl.updateCustomer(data.customer_id, {
        phone: data.phone
      })
      if (UpdateStatus) {
        console.log('phone updated')
      }
    }
    if (data.email && customerData && !customerData.email) {
      const UpdateStatus = await ShopifyCtrl.updateCustomer(data.customer_id, {
        email: data.email
      })
      if (UpdateStatus) {
        console.log('email updated')
      }
    }
    res.status(200).send(data)
  } catch (e) {
    console.log(e)
  }
})

Router.route('/updateOrder').post(async (req, res) => {
  try {
    console.log('--- route: Shopify updateOrder')
    const obj = {
      order_number: req.body.order_number,
      phone: req.body.phone || req.body.billing_address.phone,
      email: req.body.email,
      total_price: req.body.total_price,
      billing_address: req.body.billing_address,
      status: req.body.status
    }
    const data = await ShopifyCtrl.updateOrder(req.body.id, obj)
    res.status(200).send(data)
  } catch (e) {
    console.log(e)
  }
})

module.exports = Router
