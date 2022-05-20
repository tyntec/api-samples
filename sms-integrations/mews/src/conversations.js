const { composeSendMessageRequestAxiosConfig } = require('./tyntec');

class ConversationsService {
    constructor(axiosInstance, tyntecApikey) {
        this.axiosInstance = axiosInstance;
        this.tyntecApikey = tyntecApikey;
    }

    async sendMessage(from, to, channel, content) {
        const request = composeSendMessageRequestAxiosConfig(
            this.tyntecApikey,
            {
                from,
                to,
                channel,
                content
            });
        const response = await this.axiosInstance.request(request);
        return response.data;
    }
}

module.exports = {
    ConversationsService
};
