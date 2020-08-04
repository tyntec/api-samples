const express = require("express");
const zoho = require("./vendors/zoho");
const cmd = require("./vendors/cmd");
const appConfig = require("./config");

const app = express();

app.use(express.json());

app.post(
  //reopen and open share functionalites, doesn't need 2 functions for that.
  "/open",
  async (req, res) => {
    try {
      // grab data from the body
      const body = req.body;
      const mobileNumber = String(body.from.jid).split("@")[0];
      //run the Deluge function in ZOHO CRM
      await zoho.getZohoContactDetails(mobileNumber);
      res.status(200).send("Message Received");
    } catch (e) {
      console.error(e);
      return res.status(500).send("Oops! Something went wrong...");
    }
  }
);
app.post(
  "/remarks",

  async (req, res) => {
    const body = req.body;
    const remarks = {
      // remarks can be 100 char max
      remarks: `${body.Email} <br>  ${body.Mailing_City} <br> ${body.Mailing_Country}`
    };
    const id = body.id;
    await cmd.updateContactRemarks(
      appConfig.CMD_CHANNEL_JID,
      `${body.Phone}@whatsapp.eazy.im`,
      remarks
    );
    await cmd.addLinkNote(
      appConfig.CMD_CHANNEL_JID,
      `${body.Phone}@whatsapp.eazy.im`,
      id
    );

    return res.send(`Remarks for ${body.Phone} were successfully updated!`);
  }
);

app.post("/close", async (req, res) => {
  // call second delunge function with remarks
  const body = req.body;
  const mobileNumber = body.jid.toString().split("@")[0];

  const remarks = await cmd.getContactRemarks(
    appConfig.CMD_CHANNEL_JID,
    body.jid
  );
  res.status(200).send("OK");
  await zoho.updateZohoContactDetails(mobileNumber, remarks);
});

app.listen(appConfig.PORT, () => {
  console.log(`Server is listening on port ${appConfig.PORT}`);
});
