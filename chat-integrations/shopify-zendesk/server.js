'use strict'

const Express = require('express')
const BodyParser = require('body-parser')
const Mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const App = Express()

dotenv.config()
const Port = process.env.PORT || 3000;

(async () => {
  // Middlewares
  App.use(cors())
  App.use(
    BodyParser.urlencoded({
      extended: false
    })
  )
  App.use(BodyParser.json())

  // Use API routes in the App
  require('./routes')(App)

  // Connect to Mongoose database
  try {
    await Mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017', {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    console.log('DB connected successfully')
    // Start the server
    App.listen(Port, () => {
      console.log(`Server running on port ${Port}`)
    })
  } catch (e) {
    console.log('Problem while connecting to DB')
  }
})()
