# tyntec-mews-whatsapp-demo

A sample Mews-WhatsApp integration that allows ordering services using WhatsApp.

## Requirements

* A tyntec Conversations API key.
* A WhatsApp Business Account (WABA) Number provided from tyntec.
* Credentials (client token and access token) for a MEWS API environment of your choice.
* A reservation in Mews that:
  * starts in the past
  * ends in the future
  * is in the Started state (check-in)
* A catalog of products that:
  * both is connected to your WhatsApp Business Profile and is in Mews,
  * that uses product IDs in Mews as content IDs in the Facebook catalog and
  * uses the same Service ID for all products in Mews.
* A mobile phone with the WhatsApp application not associated with your WABA.
* A public URL of this app (e.g. a URL generated via ngrok).

## Installation

Use the package manager install dependencies.

```
npm install
```

## Usage
1. Copy the file .env.example to .env and set environment variables in .env:
   * `MEWS_ACCESS_TOKEN` - The access token of this app provided by Mews, depends on property.
   * `MEWS_CLIENT` - The name and version of this app.
   * `MEWS_CLIENT_TOKEN` - The unique identifier of this app provided by Mews, depends on environment (testing, staging, production).
   * `MEWS_PLATFORM_ADDRESS` - The base address of the MEWS API, depends on environment.
   * `MEWS_SERVICE_ID` - The Mews Service ID of the products in the catalog.
   * `PORT` (optional) - Start an HTTP server listening for connections on the given port. Defaults to 3000.
   * `TYNTEC_API_KEY` - Your tyntec API key.
2. Start the server
```
npm start
```
3. Register the public URL as your WhatsApp webhook.
4. Send a message with a shopping cart and with the room number of the reservation in the body to your WhatsApp Business Account.
5. Voilà!
