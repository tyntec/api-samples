# tyntec-stripe-whatsapp-demo

A sample Stripe-WhatsApp integration that allows paying for products selected using WhatsApp.

## Installation

Use the package manager install dependencies.

```
npm install
```

## Usage
1. Copy the file .env.example to .env and set environment variables in .env:
   * `PORT` (optional) - Start an HTTP server listening for connections on the given port. Defaults to 3000.
2. Optionally, adjust `SMALLEST_UNIT` map in `src/currencies.js` file according to your preferred currencies supported by Stripe https://stripe.com/docs/currencies.
3. Start the server
```
npm start
```
4. Voilà!
