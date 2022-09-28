const assert = require('assert');
const axios = require('axios');
const dotenv = require('dotenv');
const express = require('express');
const ws = require('ws');
const { ConversationsService } = require('./src/conversations');
const { CustomersService } = require('./src/customers');
const { OrdersService } = require('./src/orders');
const { ProductsService } = require('./src/products');

(async () => {
    dotenv.config();
    const FROM = process.env.FROM;
    const MEWS_ACCESS_TOKEN = process.env.MEWS_ACCESS_TOKEN;
    const MEWS_CLIENT = process.env.MEWS_CLIENT;
    const MEWS_CLIENT_TOKEN = process.env.MEWS_CLIENT_TOKEN;
    const MEWS_PLATFORM_ADDRESS = process.env.MEWS_PLATFORM_ADDRESS;
    const MEWS_SERVICE_ID = process.env.MEWS_SERVICE_ID;
    const MEWS_WEBSOCKET_ADDRESS = process.env.MEWS_WEBSOCKET_ADDRESS;
    const PORT = process.env.PORT || 3000;
    const TYNTEC_API_KEY = process.env.TYNTEC_API_KEY;

    const axiosInstance = axios.create();
    const conversationsService = new ConversationsService(axiosInstance, TYNTEC_API_KEY);
    const customersService = new CustomersService(axiosInstance, MEWS_PLATFORM_ADDRESS, MEWS_CLIENT_TOKEN, MEWS_ACCESS_TOKEN, MEWS_CLIENT);
    const ordersService = new OrdersService(axiosInstance, MEWS_PLATFORM_ADDRESS, MEWS_CLIENT_TOKEN, MEWS_ACCESS_TOKEN, MEWS_CLIENT);
    const productsService = new ProductsService(axiosInstance, MEWS_PLATFORM_ADDRESS, MEWS_CLIENT_TOKEN, MEWS_ACCESS_TOKEN, MEWS_CLIENT);

    const PRODUCTS = await productsService.getProductsByServices([MEWS_SERVICE_ID]);

    const mewsWs = new ws.WebSocket(
        MEWS_WEBSOCKET_ADDRESS,
        {
            headers: {
                Cookie: `ClientToken=${MEWS_CLIENT_TOKEN}; AccessToken=${MEWS_ACCESS_TOKEN}`
            }
        }
    );

    mewsWs.on('message', async (data) => {
        const reservationIds = JSON.parse(data).Events
            .filter(event => event.Type === 'Reservation' && event.State === 'Started')
            .map(event => event.Id);

        if (!reservationIds.length) {
            return;
        }

        const customers = await customersService.getCustomersByReservations(reservationIds);
        for (const customer of customers) {
            if (!customer.Phone) {
                continue;
            }

            await conversationsService.sendMessage(FROM, customer.Phone, 'sms', {
                contentType: 'text',
                text: `You can order ${PRODUCTS[0].Name} by sending an SMS with text "1" or ${PRODUCTS[1].Name} by sending an SMS with text "2".`
            });
        }
    });

    const app = express();
    app.use(express.json());

    app.post('/', async function (req, res) {
        const from = req.body.from;
        const productIndex = +req.body.content.text - 1;

        const customers = await customersService.getCustomersByPhones([from]);
        assert.strictEqual(customers.length, 1);
        await ordersService.createOrder(customers[0].Id, MEWS_SERVICE_ID, [
            {
                ProductId: PRODUCTS[productIndex].Id,
                Count: 1
            }
        ]);

        await conversationsService.sendMessage(FROM, from, 'sms', {
            contentType: 'text',
            text: "We've received your order. We will get working on it immediately."
        });

        res.sendStatus(204)
    })

    app.listen(PORT, () =>
        console.log(`Server listening on port ${PORT}.`)
    );
})();
