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
    composeGetAllProductsRequestAxiosConfig,
    composeGetAllReservationsRequestAxiosConfig
};
