const axios = require('axios');
const appConfig = require('../config');

async function updateContactRemarks(channelJid, contactJid, remarks) {
  try {
    await axios.default.patch(
      `https://api.cmd.tyntec.com/v3/channels/${channelJid}/contacts/${contactJid}`,
      remarks, {
        headers: {
          Authorization: `Bearer ${appConfig.CMD_API_KEY}`,
        },
      }
    );
  } catch (e) {
    throw new Error(`Unable to update Contact Remarks on: ${e}`);
  }
}

async function addLinkNote(channelJid, contactJid, id) {
  try {
    const note = {
      body: `<a href="${appConfig.ZOHO_ORG_URL}${id}"> Link to Zoho </a>`,
      referenceId: id,
      isPinned: true,
      isReadOnly: true,
    };

    await axios.default.post(
      `https://api.cmd.tyntec.com/v3/channels/${channelJid}/contacts/${contactJid}/notes`,
      note, {
        headers: {
          Authorization: `Bearer ${appConfig.CMD_API_KEY}`,
        },
      }
    );
  } catch (e) {
    throw new Error(`Unable to update Contact Remarks on: ${e}`);
  }
}

async function getContactRemarks(channelJid, contactJid) {
  try {
    response = await axios.default.get(
      `https://api.cmd.tyntec.com/v3/channels/${channelJid}/contacts/${contactJid}`, {
        headers: {
          Authorization: `Bearer ${appConfig.CMD_API_KEY}`,
        },
      }
    );
    return response.data.remarks;
  } catch (e) {
    throw new Error(`Unable to update get Contact Remarks on: ${e}`);
  }
}

module.exports = {
  updateContactRemarks,
  getContactRemarks,
  addLinkNote
};