'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const appConfig = require('./config');
const routes = require('./routes');

async function bootstrap() {
  const app = express();
  const port = appConfig.PORT;
  // Middlewares
  app.use(cors());
  app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );
  app.use(bodyParser.json());

  // Use API routes in the App
  routes(app);

  // Connect to Mongoose database
  try {
    await mongoose.connect(appConfig.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log('DB connected successfully');
  } catch (e) {
    console.log(`Problem while connecting to DB... Error: ${e}`);
  }

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
bootstrap();
