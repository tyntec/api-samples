# tyntec-mews-sms-demo

A sample Mews-SMS integration that allows ordering products using SMS.

## Requirements

* A tyntec Conversations API key.
* An SMS number provided from tyntec.
* Credentials (client token and access token) for a Mews API environment of your choice.
* An integration configured in Mews Operations to receive reservation events.
* A customer with a phone number in Mews.
* At least two active products in Mews.

## Installation

Use the package manager install dependencies.

```
npm install
```

## Usage
1. Copy the file .env.example to .env and set environment variables in .env:
  * `FROM` - The sender of the SMS messages.
  * `MEWS_ACCESS_TOKEN` - The access token of this app provided by Mews, depends on property.
  * `MEWS_CLIENT` - The name and version of this app.
  * `MEWS_CLIENT_TOKEN` - The unique identifier of this app provided by Mews, depends on environment (testing, staging, production).
  * `MEWS_PLATFORM_ADDRESS` - The base address of the Mews API, depends on environment.
  * `MEWS_SERVICE_ID` - The Mews Service ID of the product to be ordered.
  * `MEWS_WEBSOCKET_ADDRESS` - The base address for Mews WebSockets, depends on environment.
  * `TYNTEC_API_KEY` - Your tyntec API key.
2. Start the server
```
npm start
```
3. Check-in a reservation in Mews.
4. Voilà!
