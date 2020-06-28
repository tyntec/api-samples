const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const axios = require('axios');

const imapConfig = {
  imap: {
    user: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    host: process.env.IMAP_HOST,
    port: process.env.IMAP_PORT,
    tls: true,
    tlsOptions: {
      servername: process.env.IMAP_HOST,
    },
    authTimeout: 3000,
  }
};

const tyntecApiHeaders = {headers: {apikey: process.env.API_KEY}};

module.exports = async (_, response) => {
  try {
    const connection = await imaps.connect(imapConfig);
    await connection.openBox('INBOX')

    const fetchOptions = {
      bodies: [''],
      markSeen: true,
    };

    const results = await connection.search(['UNSEEN'], fetchOptions);

    results.forEach(result => {
      if (!result.parts || !result.parts[0] || !result.parts[0].body) {
        return;
      }

      simpleParser(result.parts[0].body, async (err, mail) => {
        if (err) {
          return;
        }

        const parsedSubject = /Message#([0-9\+]+)#([a-zA-Z ]+)#([-:0-9TZ]+)$/.exec(mail.subject);
        if (!parsedSubject) {
          return;
        }

        const timeDifference = new Date() - new Date(parsedSubject[3]);
        if (timeDifference > (1000 * 60 * 60 * 24)) {
          return;
        }

        const reply = mail.text.split('\n')[0];
        const sendMessage = {
          to: parsedSubject[1],
          channels: ["whatsapp"],
          whatsapp: {
            from: process.env.WABA_NUMBER,
            text: reply,
            contentType: "text"
          }
        }
        await axios.post("https://api.tyntec.com/chat-api/v2/messages", sendMessage, tyntecApiHeaders)
      });
    });
    response.status(200).send('Mail has been fetched. ' + results.length + ' email(s) forwarded.');
  } catch (error) {
    console.error('Error: ', error);
    response.sendStatus(500);
  }
}
