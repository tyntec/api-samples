'use strict';
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  thread_ts: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model('Contact', ContactSchema);
