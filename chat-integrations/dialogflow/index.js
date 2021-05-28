const express = require('express');
const { createValidator } = require('express-joi-validation');
const dialogflow = require('dialogflow');
const whatsappClient = require('./api/supportInbox');
const { trendsHandler } = require('./intents/trendsIntent');
const { availabilityHandler } = require('./intents/availabilityIntent');
const { priceHandler } = require('./intents/priceIntent');
const { appConfig } = require('./config/appConfig');
const { get } = require('lodash');

function getPhoneNumber(jid) {
  const reg = /\d+/g;
  return reg.exec(jid).toString();
} 

const messageHandler = async (req, res) => {
  try {
    const projectId = appConfig.projectId;
    const from = getPhoneNumber(req.body.from.jid)
    const to = getPhoneNumber(req.body.to)
    const sessionId = from;
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: req.body.message.body,
          languageCode: 'en-US',
        },
      },
    };

    const result = await sessionClient.detectIntent(request);
    let response;

    switch (result[0].queryResult.action) {
      case 'fashion.trends':
        response = trendsHandler(result[0]);
        break;

      case 'product.availability':
        response = availabilityHandler(result[0]);
        break;

      case 'product.price':
        response = priceHandler(result[0]);
        break;

      default:
        response = {
          text: result[0].queryResult.fulfillmentText,
        };
    }

    if (appConfig.debug=0) {
      console.log(require('util').inspect(response, false, 15));
    } else {
      await whatsappClient.sendWhatsappTextMessage({
        from: from,
        to: to,
        text: response.text,
      });
      if (response.pictures) {
        for (const picture of response.pictures) {
          await whatsappClient.sendWhatsappImage({
            from: from,
            to: to,
            media: picture,
          });
        }
      }
    }

    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
};

const validator = createValidator();
const app = express();
app.use(express.json());
app.post('/callback/message', messageHandler);
app.listen(appConfig.port, () => console.log(`Server listening on port ${appConfig.port}.`));

