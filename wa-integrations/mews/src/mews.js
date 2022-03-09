function composeAddOrderRequestAxiosConfig(platformAddress, data) {
    return {
        method: 'post',
        baseURL: platformAddress,
        url: '/api/connector/v1/orders/add',
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

function composeGetAllResourcesRequestAxiosConfig(platformAddress, data) {
    return {
        method: 'post',
        baseURL: platformAddress,
        url: '/api/connector/v1/resources/getAll',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        data
    };
}

module.exports = {
    composeAddOrderRequestAxiosConfig,
    composeGetAllReservationsRequestAxiosConfig,
    composeGetAllResourcesRequestAxiosConfig
};
