function composeGetEventRequestAxiosConfig(token, url) {
    return {
        method: 'get',
        url,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    };
}

module.exports = {
    composeGetEventRequestAxiosConfig
};
