function composeSendMessageRequestAxiosConfig(apikey, channelJid, contactJid, data) {
    return {
        method: 'post',
        url: `https://api.cmd.tyntec.com/v3/channels/${channelJid}/messages/${contactJid}`,
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${apikey}`,
            'Content-Type': 'application/json'
        },
        data
    };
}

module.exports = {
    composeSendMessageRequestAxiosConfig
};
