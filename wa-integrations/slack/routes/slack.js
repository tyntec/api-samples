const Router = require('express').Router();
const Axios = require('axios');
const Channel = require('../models/slackChannels');
const Contact = require('../models/contacts');
const handleError = require('../errorHandler').handleError;
const appConfig = require('../config');

const tyntecHeaders = {
  'Content-Type': 'application/json',
  apikey: appConfig.TYNTEC_API,
};

// This endpoint will be called to initiate/detach the Slack channel
Router.post('/', async function (req, res) {
  console.log('--- Received Slack command');
  try {
    if (req.body.text === 'detach') {
      Channel.findOneAndDelete({ channel_id: req.body.channel_id }, function (err, doc) {
        if (err) {
          res.status(500).send('DB error');
          console.log('DB delete error', err);
        } else {
          res.status(200).send('Channel detached');
          console.log('Channel detached:', req.body.channel_name);
        }
      });
      return;
    } else if (req.body.text.startsWith('close')) {
      const name = req.body.text.replace('close ', '');
      Contact.findOneAndUpdate({ name: name }, { $unset: { thread_ts: '' } }, function (err, doc) {
        if (err) {
          res.status(500).send('DB error');
          console.log('DB update error', err);
        } else if (doc) {
          res.status(200).send(`Conversation with ${name} closed`);
          console.log('Thread parent removed');
        } else {
          res.status(200).send(`Conversation with ${name} is not present`);
          console.log('Thread parent not found, but it is okay');
        }
      });
    } else if (await Channel.findOne()) {
      console.log('Channel found');
      res.status(200).send('Channel is already initiated or WhatsApp used in another channel');
    } else {
      // Store channel in the database
      Channel.create(
        {
          channel_id: req.body.channel_id,
          channel_name: req.body.channel_name,
        },
        function (err, doc) {
          if (err) {
            res.status(500).send('DB error');
            console.log('DB create error', err);
          } else {
            res.status(201).send('Channel initiated successfully');
            console.log('Channel attached:', req.body.channel_name);
          }
        }
      );
    }
  } catch (error) {
    console.log('Error in Slack channel init', error);
    res.sendStatus(500);
  }
});

Router.post('/forwardSlackMessage', async function (req, res) {
  const input = req.body;
  // Verify URL -- https://api.slack.com/events/url_verification
  if (input.challenge) {
    res.status(200).send(input.challenge);
    console.log('Webhook verified');
    return;
  }

  console.log(
    '--- Received Slack event:',
    input.event.type,
    input.event.subtype ? input.event.subtype : '',
    input.event.bot_id ? 'bot (ignored)' : ''
  );

  // Slack event data -- combi of https://api.slack.com/events/message, https://api.slack.com/types/event
  // Message events
  if (input.event.type === 'message' && !input.event.bot_id) {
    if (input.event.thread_ts) {
      console.log('Thread response');
      const contact = await Contact.findOne({ thread_ts: input.event.thread_ts });

      if (!contact) {
        res.sendStatus(204);
        console.log('No contact for thread');
        return;
      }

      console.log('Contact found by thread', contact.name);

      const url = 'https://api.tyntec.com/conversations/v3/messages';
      const inputBody = {
        to: contact.phone,
        channel: 'whatsapp',
        from: appConfig.WABA,
        content: {
          contentType: 'text',
          text: input.event.text,
        },
      };

      try {
        await Axios.post(url, inputBody, { headers: tyntecHeaders });
        res.sendStatus(204);
      } catch (e) {
        handleError(e);
        res.sendStatus(500);
      }
    } else {
      // no-thread message
      res.sendStatus(204);
      console.log("Sorry, I don't know where to send it! Only thread responses are forwarded.");
    }
  }
});

module.exports = Router;
