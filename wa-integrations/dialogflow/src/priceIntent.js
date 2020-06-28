const { products } = require('./mocks');

const priceHandler = response => {
  if (response.queryResult.allRequiredParamsPresent) {
    const price = products.find(product => (
      product.name.toLowerCase() === response.queryResult.parameters.fields.product.stringValue
    )).price;
    return {
      text: response.queryResult.fulfillmentText.replace('$price', price.toString()),
    }
  } else {
    return {
      text: response.queryResult.fulfillmentText,
    };
  }
};

module.exports = {
  priceHandler,
};
