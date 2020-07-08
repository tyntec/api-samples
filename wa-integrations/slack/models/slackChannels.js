'use strict';

const mongoose = require('mongoose');

const SlackChannelSchema = new mongoose.Schema({
  channel_id: {
    type: String,
    required: true,
    unique: true,
  },
  channel_name: {
    type: String,
  },
});

module.exports = mongoose.model('Channel', SlackChannelSchema);
