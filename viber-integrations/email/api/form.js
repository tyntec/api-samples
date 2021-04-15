const axios = require("axios");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD
  }
});

const tyntecApiHeaders = { headers: { apikey: process.env.API_KEY } };

module.exports = async (request, response) => {
  try {
    if (!request.body.phone || !request.body.name) {
      response
        .status(400)
        .send("Invalid request: both name and phone must be given.");
      return;
    }
    console.log(
      "Received an opt-in request: " +
        request.body.name +
        ", " +
        request.body.phone
    );

    const sendMessage = {
      to: request.body.phone,
      channel: "viber",
      from: process.env.VIBER_ID,
      messagePurpose: "promotion",
      content: {
        type: "text",
        //This is the initial message,
        text: `Hi ${request.body.name}, You are in! Thank you for signing up and welcome.`
      }
    };
    await axios.post(
      "https://api.tyntec.com/conversations/v3/messages",
      sendMessage,
      tyntecApiHeaders
    );

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: process.env.EMAIL,
      subject: "Optin#" + request.body.phone + "#" + request.body.name
    });

    response.status(200).send("Opted in.");
  } catch (error) {
    console.error("Error: ", error);
    response.status(500).send(error);
  }
};
