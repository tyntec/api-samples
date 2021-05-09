const express = require('express');
const dialogflow = require('dialogflow');
const whatsappClient = require('./api/tyntec');
const { trendsHandler } = require('./intents/trendsIntent');
const { availabilityHandler } = require('./intents/availabilityIntent');
const { priceHandler } = require('./intents/priceIntent');
const { appConfig } = require('./config/appConfig');

const messageHandler = async (req, res) => {
  try {
    const projectId = appConfig.projectId;
    const sessionId = req.body.from;
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: req.body.content.text,
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
        from: req.body.to,
        to: req.body.from,
        text: response.text,
      });
      if (response.pictures) {
        for (const picture of response.pictures) {
          console.log(picture)
          await whatsappClient.sendWhatsappImage({
            from: req.body.to,
            to: req.body.from,
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

const app = express();
app.use(express.json());
app.post('/callback/message', messageHandler);
app.listen(appConfig.port, () => console.log(`Server listening on port ${appConfig.port}.`));