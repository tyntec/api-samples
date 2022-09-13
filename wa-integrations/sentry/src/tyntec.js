function composeSendMessageRequestAxiosConfig(apikey, data) {
    return {
        method: 'post',
        url: 'https://api.tyntec.com/conversations/v3/messages',
        headers: {
            'accept': 'application/json',
            apikey,
            'content-type': 'application/json'
        },
        data
    };
}

module.exports = {
    composeSendMessageRequestAxiosConfig
};
