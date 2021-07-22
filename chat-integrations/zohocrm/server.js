const express = require("express");
const zoho = require("./vendors/zoho");
const cmd = require("./vendors/cmd");
const appConfig = require("./config");

const app = express();

app.use(express.json());

app.get(
    "/",
    (req, res) => {
        const authorizationUri = zoho.client.authorizationUrl();
        return res.redirect(authorizationUri);
    }
);

app.get(
    "/oauth/redirect",
    async (req, res) => {
        zoho.client.setAccountsUrl(req.query['accounts-server']);

        try {
            const callbackParams = zoho.client.callbackParams(req);
            await zoho.client.generateTokensFromCallback(callbackParams);
            res.status(200).send("OK");
        } catch (e) {
            console.error(e);
            return res.status(500).send("Oops! Something went wrong...");
        }
    }
);

app.post(
  //reopen and open share functionalites, doesn't need 2 functions for that.
  "/open",
  async (req, res) => {
    try {
      // grab data from the body
      const body = req.body;
      const mobileNumber = String(body.from.jid).split("@")[0];
      const contact = await zoho.client.getContactDetails(mobileNumber);

      const remarks = {
        // remarks can be 100 char max
        remarks: `${contact.Email} <br>  ${contact.Mailing_City} <br> ${contact.Mailing_Country}`
      };
      const id = contact.id;
      await cmd.updateContactRemarks(
          appConfig.CMD_CHANNEL_JID,
          `${contact.Phone}@whatsapp.eazy.im`,
          remarks
      );
      await cmd.addLinkNote(
          appConfig.CMD_CHANNEL_JID,
          `${contact.Phone}@whatsapp.eazy.im`,
          id
      );

      return res.send(`Remarks for ${contact.Phone} were successfully updated!`);
    } catch (e) {
      console.error(e);
      return res.status(500).send("Oops! Something went wrong...");
    }
  }
);

app.post("/close", async (req, res) => {
  try {
    const body = req.body;
    const mobileNumber = body.jid.toString().split("@")[0];
    const contact = await zoho.client.getContactDetails(mobileNumber);

    const remarks = await cmd.getContactRemarks(
      appConfig.CMD_CHANNEL_JID,
      body.jid
    );
    await zoho.client.updateContactDetails(contact.id, remarks);
    res.status(200).send("OK");
  } catch (e) {
      console.error(e);
      return res.status(500).send("Oops! Something went wrong...");
  }
});

app.listen(appConfig.PORT, () => {
  console.log(`Server is listening on port ${appConfig.PORT}`);
});
