const assert = require('assert');
const axios = require('axios');
const dotenv = require('dotenv');
const express = require('express');
const { composeSentryHookSignatureHeaderValue } = require('./src/sentry');
const { composeSendMessageRequestAxiosConfig } = require('./src/tyntec');

dotenv.config();
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const FROM = process.env.FROM;
const PORT = process.env.PORT || 3000;
const TO = process.env.TO;
const TYNTEC_API_KEY = process.env.TYNTEC_API_KEY;
const WHATSAPP_TEMPLATE_ID = process.env.WHATSAPP_TEMPLATE_ID;
const WHATSAPP_TEMPLATE_LANG = process.env.WHATSAPP_TEMPLATE_LANG;

const app = express();
app.use(express.text({type: 'application/json'}));

app.post('/', async function (req, res) {
    const expectedSignature = composeSentryHookSignatureHeaderValue(req.body, CLIENT_SECRET);
    if (req.header('Sentry-Hook-Signature') !== expectedSignature) {
        res.sendStatus(401);
        return;
    }

    const bodyJson = JSON.parse(req.body);
    assert.strictEqual(bodyJson.data.event.web_url.substring(0, 32), 'https://sentry.io/organizations/');
    const eventPath = bodyJson.data.event.web_url.substring(32);
    const ruleTitle = bodyJson.data.triggered_rule;

    const request = composeSendMessageRequestAxiosConfig(
        TYNTEC_API_KEY,
        {
            to: TO,
            from: FROM,
            channel: 'whatsapp',
            content: {
                contentType: 'template',
                template: {
                    templateId: WHATSAPP_TEMPLATE_ID,
                    templateLanguage: WHATSAPP_TEMPLATE_LANG,
                    components: {
                        body: [{ type: 'text', text: ruleTitle }],
                        button: [{ type: 'url', index: 0, text: eventPath }]
                    }
                }
            }
        });
    await axios(request);

    res.sendStatus(204)
})

app.listen(PORT, () =>
    console.log(`Server listening on port ${PORT}.`)
);
