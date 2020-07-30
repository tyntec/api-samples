const express = require('express');
const watsonHandler = require('./watsonHandler');
const tyntecHandler = require('./tyntecHandler');
const cache = require('./cacheState');
const appConfig = require('./config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/message', async (req, res) => {
	const to = req.body.from.jid;
	const text = JSON.stringify(req.body.message.body);
	const result = await watsonHandler.sendTextToWatson(text);
	tyntecHandler.sendMessageToWhatsapp(to, result);

	res.status(201).send('success');
});

app.get('/session', async (req, res) => {
	const sessionID = await watsonHandler.createSession();
	cache.setNewSession(sessionID);
	res.status(200).send('Cached session: ' + sessionID);
});

app.listen(appConfig.PORT, function () {
	console.log(`Server is listening on port ${appConfig.PORT}`);
});
