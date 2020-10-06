const express = require('express');
const bodyParser = require('body-parser');
const appConfig = require('./config');

var app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

const routes = require('./routes/bot');
app.use('/', routes);

app.listen(appConfig.PORT, function () {
  console.log(`Server listening on port: ${appConfig.PORT}`);
});
