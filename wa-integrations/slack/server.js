'use strict';

const Express = require('express');
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');
const cors = require('cors');
const appConfig = require('./config');

const app = Express();

(async () => {
  // Middlewares
  app.use(cors());
  app.use(
    BodyParser.urlencoded({
      extended: false,
    })
  );
  app.use(BodyParser.json());

  // Use API routes in the App
  require('./routes/index')(app);
  app.get('/', (req, res) => {
    res.status(200).send('Server running');
  });

  // Connect to Mongoose database
  try {
    await Mongoose.connect(appConfig.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log('DB connected successfully');
    // Start the server
    app.listen(appConfig.PORT, () => {
      console.log(`Server running on port ${appConfig.PORT}`);
    });
  } catch (e) {
    console.log('Problem while connecting to DB');
  }
})();
