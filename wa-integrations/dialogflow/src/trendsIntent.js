const { products } = require('./mocks');

const trendsHandler = (response) => {
  if (response.queryResult.allRequiredParamsPresent) {
    return {
      text: response.queryResult.fulfillmentText,
      pictures: products
        .filter(product => product.category === response.queryResult.parameters.fields.Category.stringValue)
        .map(product => ({
          caption: product.name,
          type: 'image',
          url: product.picture,
        })),
    }
  } else {
    return {
      text: response.queryResult.fulfillmentText,
    };
  }
};

module.exports = {
  trendsHandler,
};
