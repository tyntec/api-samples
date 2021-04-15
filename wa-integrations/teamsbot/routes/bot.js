const router = require('express').Router();
const axios = require('axios');
const hashMap = require('hashmap');
const { BotFrameworkAdapter, TurnContext } = require('botbuilder');
const handleError = require('../errorHandler').handleError;
const appConfig = require('../config');

// Create bot adapter
const botAdapter = new BotFrameworkAdapter({
  appId: appConfig.MICROSOFT_BOT_ID,
  appPassword: appConfig.MICROSOFT_BOT_PASSWORD,
});

// Catch-all for bot errors
botAdapter.onTurnError = async (turnContext, error) => {
  console.error('\n[onTurnError] unhandled error: ' + error);
  // Send a trace activity, which will be displayed in Bot Framework Emulator
  await turnContext.sendTraceActivity('OnTurnError Trace', error, 'https://www.botframework.com/schemas/error', 'TurnError');

  // Send a message to the user
  await turnContext.sendActivity('The bot encountered an error or bug.');
  await turnContext.sendActivity('To continue to run this bot, please fix the bot source code.');
};

var teamsUsers = new hashMap(); // List of all registered Teams users

// Common function for sending a message to WhatsApp
async function sendWAMessage(phoneNumber, messageText, res) {
  const tyntecHeaders = {
    'Content-Type': 'application/json',
    apikey: appConfig.TYNTEC_API_KEY,
  };

  const url = 'https://api.tyntec.com/conversations/v3/messages';
  const inputBody = {
    to: phoneNumber,
    from: appConfig.TYNTEC_WABA_NUMBER,
    channel: 'whatsapp',
    content: {
      contentType: 'text',
      text: messageText,
    },
  };

  try {
    await axios.post(url, inputBody, { headers: tyntecHeaders });
    res.sendStatus(204);
  } catch (e) {
    handleError(e);
    res.sendStatus(500);
  }
}

// Teams -> WhatsApp
router.post('/forwardWhatsApp', function (req, res, next) {
  botAdapter.processActivity(req, res, async (turnContext) => {
    if (turnContext.activity.type === 'message') {
      // Check if user is already known
      if (teamsUsers.has(turnContext.activity.from.id) == false) {
        // If not, Add the Teams user to list of all users and set availability to true
        console.log('First time this Teams user is recognized.');

        var userDetail = {};
        userDetail.available = true;
        userDetail.conversationReference = TurnContext.getConversationReference(turnContext.activity);
        userDetail.assignedWhatsAppNumber = 0;
        teamsUsers.set(turnContext.activity.from.id, userDetail);

        var message =
          'Hey, welcome to the bot. Your Teams user ID: **' +
          turnContext.activity.from.id +
          '**. You will now receive messages from WhatsApp.';
        await turnContext.sendActivity(message);

        console.log('All Teams users:\n');
        console.log(teamsUsers);
      } else {
        console.log('Send input from Teams user to WhatsApp.');
        console.log('Received Teams message: ', turnContext.activity.text);
        console.log('From user: ', turnContext.activity.from.id);

        await sendWAMessage(teamsUsers.get(turnContext.activity.from.id).assignedWhatsAppNumber, turnContext.activity.text, res);
      }

      next();
    }
  });
});

// WhatsApp -> Teams
router.post('/forwardTeams', async (req, res) => {
  console.log('Send input from WhatsApp to Teams user.');
  console.log('Received WA message: ', req.body.content.text);
  console.log('From number: ', req.body.from);
  var phoneNumber = req.body.from;

  // Check if this WA number is already assigned to a conversation with a Teams user
  var foundConversation = false;

  teamsUsers.forEach(function (userDetail, key) {
    if (userDetail.assignedWhatsAppNumber == phoneNumber) {
      foundConversation = true;
      userID = key;
    }
  });

  if (foundConversation == true) {
    // If yes, continue the conversation
    await botAdapter.continueConversation(teamsUsers.get(userID).conversationReference, async (turnContext) => {
      await turnContext.sendActivity(req.body.content.text);
    });
    res.sendStatus(204);
  } else {
    // If not, find the next free Teams user
    var teamsUserAvailable = false;
    var userDetailCopy = null;

    teamsUsers.forEach(function (userDetail, key) {
      if (userDetail.available == true) {
        teamsUserAvailable = true;
        userID = key;
        userDetailCopy = userDetail;
      }
    });

    if (teamsUserAvailable == true) {
      // Found an available Teams user
      userDetailCopy.available = false;
      userDetailCopy.assignedWhatsAppNumber = phoneNumber;
      teamsUsers.set(userID, userDetailCopy);

      console.log('Number ' + phoneNumber + ' assigned to Teams user ID ' + userID);

      await botAdapter.continueConversation(teamsUsers.get(userID).conversationReference, async (turnContext) => {
        await turnContext.sendActivity(req.body.content.text);
      });
      res.sendStatus(204);
    } else {
      sendWAMessage(phoneNumber, 'Sorry, no free Teams user available. Please try again later.', res);
    }
  }
});

module.exports = router;
