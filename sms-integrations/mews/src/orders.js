const { composeAddOrderRequestAxiosConfig } = require('./mews');

class OrdersService {
    constructor(axiosInstance, mewsPlatformAddress, mewsClientToken, mewsAccessToken, mewsClient) {
        this.axiosInstance = axiosInstance;
        this.mewsPlatformAddress = mewsPlatformAddress;
        this.mewsClientToken = mewsClientToken;
        this.mewsAccessToken = mewsAccessToken;
        this.mewsClient = mewsClient;
    }

    async createOrder(CustomerId, ServiceId, ProductOrders) {
        const request = composeAddOrderRequestAxiosConfig(
            this.mewsPlatformAddress,
            {
                ClientToken: this.mewsClientToken,
                AccessToken: this.mewsAccessToken,
                Client: this.mewsClient,
                CustomerId,
                ServiceId,
                ProductOrders
            }
        );
        const response = await this.axiosInstance.request(request);
        return response.data;
    }
}

module.exports = {
    OrdersService
};
