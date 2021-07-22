# Integration of Chat Messaging Dashboard with Shopify & Zendesk


Read more in our [Quick Tutorial](https://www.tyntec.com/docs/support-inbox-integration-support-inbox-shopify-zendesk).

---------------------------------------

## Prerequisities

* Your Support Inbox API key provided by tyntec (contact tyntec support if you don't' have it)
* A Zendesk account with the Customer Support option (subscription allowing custom business rules)
* A Shopify account with Zendesk app installed and the Web Widget enabled
* Node.js and your favorite text editor or IDE with JavaScript highlighting
* MongoDB installed locally for development
* A ngrok account and the binary installed for development

## Install
1. Clone the repo and go to the shopify-zendesk folder.
2. Install dependencies via `npm install`
3. Copy .env-example to .env and set environment variables in .env:
    - WABA_NUMBER -- your WABA number in international format without the leading +/00
    - CMD_API_KEY -- your API key from tyntec to authenticate calls to Support Inbox API
    - MONGO_URL -- optional MongoDB location (defaults to the local instance mongodb://127.0.0.1:27017)
    - PORT -- optional server port (defaults to 3000)
    - SHOPIFY_DOMAIN -- yourstore.myshopify.com
    - CHANNEL -- set it to `whatsapp` or `viber` if you don't select it, the app will use both channels.
4. Start the app with `npm start`. For dev, use `nodemon server.js` instead.

