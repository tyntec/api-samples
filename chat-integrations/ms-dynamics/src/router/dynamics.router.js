import express from 'express';
import { appConfig } from '../config/config.js';
import { DynamicsConnector } from '../services/dynamicsConnector.service.js';

const router = express.Router();
const re = new RegExp('^(.+?)@');

const dynamics = new DynamicsConnector(
  appConfig.dynamicsTenantId,
  appConfig.dynamicsHost,
  appConfig.dynamicsCliendId,
  appConfig.dynamicsUserName,
  appConfig.dynamicsPassword
).dynamicsWebApi;

router.post('/webhook', async (req, res) => {
  // extract data
  const payload = req.body;
  const name = payload.from.name;
  const jid = payload.from.jid;
  const message = payload.message.body;
  const messageId = payload.message.id;
  const phoneNumber = re.exec(jid).pop();

  // call dynamics
  const filter = `contains(fullname, '${name}')`;
  let entityContactData = (
    await dynamics
      .retrieveAll('contacts', ['fullname', 'mobilephone'], filter)
      .catch((err) => {
        console.log(err);
      })
  ).value[0];

  // check if exists - if not, create
  if (!entityContactData) {
    const names = name.split(' ');
    // create message entity
    const contactEntity = {
      firstname: names[0],
      lastname: names[1],
      mobilephone: phoneNumber,
    };
    const contactRequest = {
      entity: contactEntity,
      collection: 'contacts',
      returnRepresentation: true,
    };
    entityContactData = await dynamics.createRequest(contactRequest);
  }

  // create message entity
  const messageEntity = {
    cr1b1_message: messageId,
    cr1b1_messagebody: message,
    'cr1b1_party@odata.bind': `/contacts(${entityContactData.contactid})`,
  };
  const messageRequest = {
    entity: messageEntity,
    collection: 'cr1b1_messagerecords',
    returnRepresentation: true,
  };
  const result = await dynamics.createRequest(messageRequest);
  res.send(result);
});

export default router;
