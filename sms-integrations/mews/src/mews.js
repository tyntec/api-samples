function composeGetAllCustomersRequestAxiosConfig(platformAddress, data) {
    return {
        method: 'post',
        baseURL: platformAddress,
        url: '/api/connector/v1/customers/getAll',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        data
    };
}

function composeGetAllProductsRequestAxiosConfig(platformAddress, data) {
    return {
        method: 'post',
        baseURL: platformAddress,
        url: '/api/connector/v1/products/getAll',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        data
    };
}

function composeGetAllReservationsRequestAxiosConfig(platformAddress, data) {
    return {
        method: 'post',
        baseURL: platformAddress,
        url: '/api/connector/v1/reservations/getAll',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        data
    };
}

module.exports = {
    composeGetAllCustomersRequestAxiosConfig,
    composeGetAllProductsRequestAxiosConfig,
    composeGetAllReservationsRequestAxiosConfig
};
