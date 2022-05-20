class OrdersService {
    constructor(axiosInstance, mewsPlatformAddress, mewsClientToken, mewsAccessToken, mewsClient) {
        this.axiosInstance = axiosInstance;
        this.mewsPlatformAddress = mewsPlatformAddress;
        this.mewsClientToken = mewsClientToken;
        this.mewsAccessToken = mewsAccessToken;
        this.mewsClient = mewsClient;
    }
}

module.exports = {
    OrdersService
};
