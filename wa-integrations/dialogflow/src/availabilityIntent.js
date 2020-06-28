const { products } = require('./mocks');

const availabilityHandler = (response) => {
  if (response.queryResult.allRequiredParamsPresent) {
    const availability = products.some(product => (
      product.sizes.includes(response.queryResult.parameters.fields.size.stringValue) &&
      product.colors.includes(response.queryResult.parameters.fields.color.stringValue) &&
      product.name.toLowerCase() === response.queryResult.parameters.fields.product.stringValue
    )) ? 'available! Yay!' : 'not available, sorry.';
    return {
      text: response.queryResult.fulfillmentText.replace('$availability', availability),
    }
  } else {
    return {
      text: response.queryResult.fulfillmentText,
    };
  }
};

module.exports = {
  availabilityHandler,
}
