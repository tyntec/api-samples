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
    composeGetAllResourcesRequestAxiosConfig
};
