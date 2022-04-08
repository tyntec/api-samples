const axios = require('axios');
const dotenv = require('dotenv');
const express = require('express');
const { composeGetEventRequestAxiosConfig } = require('./src/calendly');
const { composeSendMessageRequestAxiosConfig } = require('./src/tyntec');

dotenv.config();
const CALENDLY_TOKEN = process.env.CALENDLY_TOKEN;
const FROM = process.env.FROM;
const PORT = process.env.PORT || 3000;
const TYNTEC_API_KEY = process.env.TYNTEC_API_KEY;
const WHATSAPP_TEMPLATE_ID = process.env.WHATSAPP_TEMPLATE_ID;
const WHATSAPP_TEMPLATE_LANG = process.env.WHATSAPP_TEMPLATE_LANG;

const app = express();
app.use(express.json());

app.post('/', async function (req, res) {
    if (!req.body.payload.text_reminder_number || req.body.payload.rescheduled) {
        res.sendStatus(204);
        return;
    }

    const getEventRequest = composeGetEventRequestAxiosConfig(CALENDLY_TOKEN, req.body.payload.event);
    const eventResponse = await axios(getEventRequest);

    const startTime = new Date(eventResponse.data.resource.start_time).toLocaleString();
    const request = composeSendMessageRequestAxiosConfig(
        TYNTEC_API_KEY,
        {
            to: req.body.payload.text_reminder_number,
            from: FROM,
            channel: 'whatsapp',
            content: {
                contentType: 'template',
                template: {
                    templateId: WHATSAPP_TEMPLATE_ID,
                    templateLanguage: WHATSAPP_TEMPLATE_LANG,
                    components: {
                        body: [
                            { type: 'text', text: eventResponse.data.resource.name },
                            { type: 'text', text: startTime }
                        ]
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
