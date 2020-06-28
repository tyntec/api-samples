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

const tyntecApiHeaders = {headers: {apikey: process.env.API_KEY}};

module.exports = async (request, response) => {

  try {
    if (!request.body.phone || !request.body.name) {
      response.status(400).send('Invalid request: both name and phone must be given.');
      return;
    }
    console.log('Received an opt-in request: ' + request.body.name + ', ' + request.body.phone);

    const sendMessage = {
      to: request.body.phone,
      channels: ["whatsapp"],
      whatsapp: {
        from: process.env.WABA_NUMBER,
        template: {
          templateId: "welcome_message",
          language: {
            policy: "deterministic",
            code: "en"
          },
          components: [
            {
              type: "body",
              parameters: [{type: "text", text: request.body.name}]
            }
          ]
        },
        contentType: "template"
      }
    };

    await axios.post("https://api.tyntec.com/chat-api/v2/messages", sendMessage, tyntecApiHeaders)

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: process.env.EMAIL,
      subject: 'Optin#' + request.body.phone + '#' + request.body.name,
    });

    response.status(200).send('Opted in.');

  } catch (error) {
    console.error('Error: ', error);
    response.status(500).send(error);
  }
};
