const { composeGetAllProductsRequestAxiosConfig } = require('./mews');

class ProductsService {
    constructor(axiosInstance, mewsPlatformAddress, mewsClientToken, mewsAccessToken, mewsClient) {
        this.axiosInstance = axiosInstance;
        this.mewsPlatformAddress = mewsPlatformAddress;
        this.mewsClientToken = mewsClientToken;
        this.mewsAccessToken = mewsAccessToken;
        this.mewsClient = mewsClient;
    }

    async getProductsByServices(ServiceIds) {
        const request = composeGetAllProductsRequestAxiosConfig(
            this.mewsPlatformAddress,
            {
                ClientToken: this.mewsClientToken,
                AccessToken: this.mewsAccessToken,
                Client: this.mewsClient,
                ServiceIds
            }
        );
        const response = await this.axiosInstance.request(request);
        return response.data.Products;
    }
}

module.exports = {
    ProductsService
};
