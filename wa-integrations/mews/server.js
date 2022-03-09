const assert = require('assert');
const axios = require('axios');
const dotenv = require('dotenv');
const express = require('express');
const { composeAddOrderRequestAxiosConfig, composeGetAllReservationsRequestAxiosConfig, composeGetAllResourcesRequestAxiosConfig } = require('./src/mews');
const { composeSendMessageRequestAxiosConfig } = require('./src/tyntec');

dotenv.config();
const MEWS_ACCESS_TOKEN = process.env.MEWS_ACCESS_TOKEN;
const MEWS_CLIENT = process.env.MEWS_CLIENT;
const MEWS_CLIENT_TOKEN = process.env.MEWS_CLIENT_TOKEN;
const MEWS_PLATFORM_ADDRESS = process.env.MEWS_PLATFORM_ADDRESS;
const MEWS_SERVICE_ID = process.env.MEWS_SERVICE_ID;
const PORT = process.env.PORT || 3000;
const TYNTEC_API_KEY = process.env.TYNTEC_API_KEY;

const app = express();
app.use(express.json());

app.post('/', async function (req, res) {
    const resourceName = req.body.order.text;
    const ProductOrders = req.body.order.items.map(item => ({ ProductId: item.productId, Count: +item.quantity}));

    const resourcesRequest = composeGetAllResourcesRequestAxiosConfig(
        MEWS_PLATFORM_ADDRESS,
        {
            ClientToken: MEWS_CLIENT_TOKEN,
            AccessToken: MEWS_ACCESS_TOKEN,
            Client: MEWS_CLIENT,
            Extent: { Resources: true }
        }
    );
    const resourcesResponse = await axios(resourcesRequest);
    const resources = resourcesResponse.data.Resources.filter(resource => resource.IsActive && resource.Name === resourceName && resource.Data.Discriminator === "Space");
    assert.strictEqual(resources.length, 1);
    const resourceId = resources[0].Id;

    const reservationsRequest = composeGetAllReservationsRequestAxiosConfig(
        MEWS_PLATFORM_ADDRESS,
        {
            ClientToken: MEWS_CLIENT_TOKEN,
            AccessToken: MEWS_ACCESS_TOKEN,
            Client: MEWS_CLIENT,
            TimeFilter: 'Overlapping',
            StartUtc: new Date().toISOString(),
            EndUtc: new Date().toISOString(),
            AssignedResourceIds: [resourceId],
            States: ['Started'],
            Extent: { Reservations: true }
        }
    );
    const reservationsResponse = await axios(reservationsRequest);
    assert.strictEqual(reservationsResponse.data.Reservations.length, 1);
    const CustomerId = reservationsResponse.data.Reservations[0].CustomerId;

    const orderRequest = composeAddOrderRequestAxiosConfig(
        MEWS_PLATFORM_ADDRESS,
        {
            ClientToken: MEWS_CLIENT_TOKEN,
            AccessToken: MEWS_ACCESS_TOKEN,
            Client: MEWS_CLIENT,
            CustomerId,
            ServiceId: MEWS_SERVICE_ID,
            ProductOrders
        }
    );
    await axios(orderRequest);

    const request = composeSendMessageRequestAxiosConfig(
        TYNTEC_API_KEY,
        {
            from: req.body.to,
            to: req.body.from,
            channel: 'whatsapp',
            content: {
                contentType: 'text',
                text: "We've received your order. We will get working on it immediately."
            }
        });
    await axios(request);

    res.sendStatus(204)
})

app.listen(PORT, () =>
    console.log(`Server listening on port ${PORT}.`)
);
