# cmd-wa-stripe

A sample Stripe-Inbox integration that allows paying for products selected using WhatsApp.

## Requirements

* A tyntec Conversations Inbox API key.
* A WhatsApp Business Account Number provided from tyntec.
* A WhatsApp message template that:
  * acknowledges receipt of the shopping cart and instructs user to proceed to checkout (e.g. "Very good choice! Now, proceed to checkout to complete your order."),
  * has no variable in the header
  * has no variable in the body
  * has one Call-to-Action button with `https://checkout.stripe.com/pay/{{1}}` dynamic URL (an example of the URL is `https://checkout.stripe.com/pay/sk_test_RXHltS2OKzISvxWQ7NmRN57i001oa6x7o4#abcdEFGH1234%2F5678IJKLmnop`)
* A catalog connected to your WhatsApp Business Profile.
* A Stripe account with an account or business name set at https://dashboard.stripe.com/account.
* A mobile phone with the WhatsApp application not associated with your WABA.
* A public URL of this app (e.g. a URL generated via ngrok).

## Installation

Use the package manager install dependencies.

```
npm install
```

## Usage
1. Copy the file .env.example to .env and set environment variables in .env:
   * `PORT` (optional) - Start an HTTP server listening for connections on the given port. Defaults to 3000.
   * `PUBLIC_URL` - The public URL.
   * `STRIPE_SECRET_API_KEY` - Your Stripe secret API key.
   * `TYNTEC_API_KEY` - Your tyntec API key.
   * `WHATSAPP_TEMPLATE_LANG` - A chosen language of our WhatsApp template.
   * `WHATSAPP_TEMPLATE_NAME` - The name of your WhatsApp template.
2. Optionally, adjust `SMALLEST_UNIT` map in `src/currencies.js` file according to your preferred currencies supported by Stripe https://stripe.com/docs/currencies.
3. Start the server
```
npm start
```
4. Voilà!
