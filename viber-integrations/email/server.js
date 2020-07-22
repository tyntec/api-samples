var express = require("express"),
  bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const optin = require("./api/form.js");
app.use(express.static("static"));
const mailfetch = require("./api/fetch.js");
app.get("/mailfetch", mailfetch);
app.post("/optin", optin);
const incoming = require("./api/incoming.js");
app.post("/incoming", incoming);

var listener = app.listen(3000, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
