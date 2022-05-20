const { composeGetAllCustomersRequestAxiosConfig, composeGetAllReservationsRequestAxiosConfig, composeSearchCustomersRequestAxiosConfig } = require("./mews");

class CustomersService {
    constructor(axiosInstance, mewsPlatformAddress, mewsClientToken, mewsAccessToken, mewsClient) {
        this.axiosInstance = axiosInstance;
        this.mewsPlatformAddress = mewsPlatformAddress;
        this.mewsClientToken = mewsClientToken;
        this.mewsAccessToken = mewsAccessToken;
        this.mewsClient = mewsClient;
    }

    async getCustomersByPhones(phones) {
        const request = composeSearchCustomersRequestAxiosConfig(
            this.mewsPlatformAddress,
            {
                ClientToken: this.mewsClientToken,
                AccessToken: this.mewsAccessToken,
                Client: this.mewsClient,
                Extent: {
                    Customers: true,
                    Documents: false,
                    Addresses: false
                }
            }
        );
        const response = await this.axiosInstance.request(request);
        return response.data.Customers
            .filter(customer => phones.includes(customer.Customer.Phone))
            .map(customer => customer.Customer);
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
