import express from 'express';
import bodyParser from 'body-parser';
import { appConfig } from './config/config.js';
import router from './router/dynamics.router.js';

const app = express();
const port = appConfig.port;

app.use(bodyParser.json());

app.use('/', router);

app.listen(port, () => {
  console.log(`App listening @ http://localhost:${port}`);
});
