# tyntec-sentry-whatsapp-demo

A sample Sentry-WhatsApp integration that allows sending alerts using WhatsApp.

## Requirements

* A tyntec Conversations API key.
* A WhatsApp Business Account (WABA) Number provided from tyntec.
* A WhatsApp message template that:
  * informs you that an alert was triggered (e.g. "Sentry alert: {{1}}"),
  * has no variable in the header
  * has one variable in the body - the label of the rule that was triggered (e.g. "Very Important Alert Rule!")
  * has one Call-to-Action button with `https://sentry.io/organizations/{{1}}` dynamic URL - the web URL for the event that triggered the alert rule (an example of the URL is "https://sentry.io/organizations/test-org/issues/1117540176/events/e4874d664c3540c1a32eab185f12c5ab/")
* A mobile phone with the WhatsApp application not associated with your WABA.
* A public URL of this app (e.g. a URL generated via ngrok).
* A Sentry internal integration with the Webhook URL set to the public URL of this app and Alert Rule Action enabled.

## Installation

Use the package manager install dependencies.

```
npm install
```

## Usage
1. Copy the file .env.example to .env and set environment variables in .env:
   * `CLIENT_SECRET` - Your Sentry integration's client Secret.
   * `FROM` - Your WABA Number.
   * `PORT` (optional) - Start an HTTP server listening for connections on the given port. Defaults to 3000.
   * `TO` - Your phone number.
   * `TYNTEC_API_KEY` - Your tyntec API key.
   * `WHATSAPP_TEMPLATE_ID` - The ID of your WhatsApp template.
   * `WHATSAPP_TEMPLATE_LANG` - A chosen language of your WhatsApp template.
2. Start the server
```
npm start
```
3. In Sentry, create an alert that sends notifications via your integration.
4. Trigger the alert.
5. Voilà!
