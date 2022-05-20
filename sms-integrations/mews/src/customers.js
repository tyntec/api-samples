const { composeGetAllCustomersRequestAxiosConfig, composeGetAllReservationsRequestAxiosConfig } = require("./mews");

class CustomersService {
    constructor(axiosInstance, mewsPlatformAddress, mewsClientToken, mewsAccessToken, mewsClient) {
        this.axiosInstance = axiosInstance;
        this.mewsPlatformAddress = mewsPlatformAddress;
        this.mewsClientToken = mewsClientToken;
        this.mewsAccessToken = mewsAccessToken;
        this.mewsClient = mewsClient;
    }

    async getCustomersByReservations(ReservationIds) {
        const reservationsRequest = composeGetAllReservationsRequestAxiosConfig(
            this.mewsPlatformAddress,
            {
                ClientToken: this.mewsClientToken,
                AccessToken: this.mewsAccessToken,
                Client: this.mewsClient,
                ReservationIds,
                Extent: {
                    Reservations: true
                }
            }
        );
        const reservationsResponse = await this.axiosInstance.request(reservationsRequest);
        const CustomerIds = reservationsResponse.data.Reservations.map(reservation => reservation.CustomerId);

        const customersRequest = composeGetAllCustomersRequestAxiosConfig(
            this.mewsPlatformAddress,
            {
                ClientToken: this.mewsClientToken,
                AccessToken: this.mewsAccessToken,
                Client: this.mewsClient,
                CustomerIds,
                Extent: {
                    Customers: true,
                    Documents: false,
                    Addresses: false
                }
            }
        );
        const customersResponse = await this.axiosInstance.request(customersRequest);
        return customersResponse.data.Customers;
    }
}

module.exports = {
    CustomersService
};
