const express = require('express');
const path = require('path');
const createMeeting = require('./api/createMeeting.js');
const { appConfig } = require('./config/appConfig');

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'static/index.html')));
app.post('/create-meeting', createMeeting);
app.listen(appConfig.port, () => console.log(`Server listening on port ${appConfig.port}.`));