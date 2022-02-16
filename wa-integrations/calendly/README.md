# tyntec-calendly-whatsapp-demo

A sample Calendly-WhatsApp integration that sends notifications via WhatsApp.

## Requirements

* A tyntec Conversations API key.
* A WhatsApp Business Account (WABA) Number provided from tyntec.
* A WhatsApp message template that:
  * inform you that an invitee has booked an event (e.g. "Reminder: {{1}} at {{2}}."),
  * has no variable in the header
  * has two variables in the body:
    1. the event name (e.g. "15 Minute Meeting") and
    2. the moment the event was scheduled to start in UTC time (e.g. "2020-01-02T03:04:05.678Z")
  * has no button
* A Calendly access token for a paid premium subscription and above.
* A mobile phone with the WhatsApp application not associated with your WABA.
* A public URL of this app (e.g. a URL generated via ngrok).

## Installation

Use the package manager install dependencies.

```
npm install
```

## Usage
1. Copy the file .env.example to .env and set environment variables in .env:
   * `CALENDLY_TOKEN` - Your Calendly access token.
   * `FROM` - Your WABA Number.
   * `PORT` (optional) - Start an HTTP server listening for connections on the given port. Defaults to 3000.
   * `TYNTEC_API_KEY` - Your tyntec API key.
   * `WHATSAPP_TEMPLATE_ID` - The ID of your WhatsApp template.
   * `WHATSAPP_TEMPLATE_LANG` - A chosen language of your WhatsApp template.
2. Start the server.
```
npm start
```
3. Register the public URL as your Calendly webhook for invitee.created events.
4. Book an event with a text message reminder to your phone number.
5. Voilà!
