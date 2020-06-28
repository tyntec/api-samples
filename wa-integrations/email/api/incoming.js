const axios = require('axios');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD,
  }
});

module.exports = async (request, response) => {
  console.log('Received message', request);
  var subject;
  try {
    const body = request.body;
    if (!body.from || !body.receivedAt || !body.content || !body.content.text || !body.whatsapp || !body.whatsapp.senderName) {
      console.error(body);
      response.status(400).send('Invalid request');
      return;
    }
    subject = 'Message#' + body.from + '#' + body.whatsapp.senderName + '#' + body.receivedAt;
    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: process.env.EMAIL,
      subject: subject,
      text: body.content.text
    });
  } catch (error) {
    console.error('Error: ', error);
    response.sendStatus(500);
  }

  console.log("Forwarded as: " + subject);
  response.sendStatus(204);
};
