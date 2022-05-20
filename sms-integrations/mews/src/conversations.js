class ConversationsService {
    constructor(axiosInstance, tyntecApikey) {
        this.axiosInstance = axiosInstance;
        this.tyntecApikey = tyntecApikey;
    }
}

module.exports = {
    ConversationsService
};
