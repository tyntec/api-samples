const crypto = require('crypto');

function composeSentryHookSignatureHeaderValue(requestBody, clientSecret) {
    const hmac = crypto.createHmac('sha256', clientSecret);
    hmac.update(requestBody, 'utf8');
    return hmac.digest('hex');
}

module.exports = {
    composeSentryHookSignatureHeaderValue
};
