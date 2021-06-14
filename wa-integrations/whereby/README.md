# tyntec-whereby-demo

A sample Whereby-WhatsApp integration that allows sharing new Whereby meetings with your WhatsApp contacts.

## Requirements 
* tyntec Conversations API key
* WhatsApp Business Account Number provided from tyntec
* WhatsApp message template that:
  * will mention event inviting. For testing, we have used: *Hello,\n we re excited to show you a new integration with WhatsApp. Do you have five minutes to join our integration showcase? Our dev team is at {{1}} right now.*
* Whereby API key

## Installation

Use the package manager install dependencies.

```
npm install
```

## Usage
1. Copy the file .env-example to .env and set environment variables in .env:
    * PORT=3000: Tells you on which specific port the application runs.
    * TYNTEC_API_KEY= "Your tyntec API key"
    * TYNTEC_BASE_URL= "https://api.tyntec.com/conversations/v3/messages"
    * WHEREBY_API_KEY= "Your Whereby API key"
    * WABA_NUMBER = “Your WhatsApp Business Account Number”
    * TEMPLATE_ID = “Your WhatsApp template ID”
    * TEMPLATE_LANGUAGE: “Your WhatsApp template language”
1. Open the utils/mocks.js and update it with your fallback hardcoded phone numebers:
```
const mockedNumbers = ['123123123123', '123456789123', '111222333444'];
```
1. Run the server
```
npm start
```
2. Go the http://localhost:3000/
3. Fill the phone numbers field, select the start and the end date and press the create meeting button.
4. Voilà!
