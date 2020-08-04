'use strict';

const Router = require('express').Router();
const Axios = require('axios');
const Contacts = require('../models/contacts');
const SlackChannels = require('../models/slackChannels');
const handleError = require('../errorHandler').handleError;
const appConfig = require('../config');
const _ = require("lodash")

const slackHeaders = {
  'Content-Type': 'application/json;charset=utf-8',
  Authorization: 'Bearer ' + appConfig.SLACK_BOT,
};

// Receive WA message and forward it to Slack
Router.route('/forwardWAMessage').post(async function (req, res) {
  console.log('--- Received WA message:', req.body.content.text);
  console.log('    Msg ID:', req.body.messageId);
  const channel = await SlackChannels.findOne();
  if (!channel) {
    console.log('No channel attached. Run /whatsapp slash command in a channel first.');
    res.sendStatus(400);
    return;
  }
  let contact = await Contacts.findOne({ phone: req.body.from });
  if (!contact) {
    try {
      contact = await Contacts.create(
        {
          phone: req.body.from,
          name: req.body.whatsapp.senderName,
          thread_ts: "no thread assigned"+req.body.from
        });
      console.log('Contact created:', contact.name);
    } catch (err) {
      res.status(500).send('DB error');
      console.log('DB create error', err);
    }
  } else console.log('Contact found:', contact.name);

  const url = 'https://slack.com/api/chat.postMessage';
  const inputBody = {
    channel: channel.channel_id,
    text: `*${req.body.whatsapp.senderName}*: ${req.body.content.text}`,
  };

  if (!_.startsWith(contact.thread_ts, "no thread assigned")) {
    inputBody.thread_ts = contact.thread_ts;
    console.log('Thread found');
  }

  try {
    // Send request to Slack
    const slackRes = await Axios.post(url, inputBody, { headers: slackHeaders });
    console.log('Slack res:', slackRes.data);
    if (_.startsWith(contact.thread_ts, "no thread assigned")) {
      Contacts.findOneAndUpdate({ phone: contact.phone }, { $set: { thread_ts: slackRes.data.ts } }, function (err, doc) {
        if (err) {
          res.status(500).send('DB error');
          console.log('DB update error', err);
        } else {
          console.log('Thread parent saved:', slackRes.data.ts);
        }
      });
    }
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
    handleError(error);
  }
});

module.exports = Router;
