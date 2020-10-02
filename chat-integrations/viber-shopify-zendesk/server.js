'use strict';

const Express = require('express');
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');
const cors = require('cors');
const appConfig = require('./config');
const App = Express();

const Port = appConfig.PORT || 3000;

(async () => {
	// Middlewares
	App.use(cors());
	App.use(
		BodyParser.urlencoded({
			extended: false,
		})
	);
	App.use(BodyParser.json());

	// Use API routes in the App
	require('./routes')(App);

	// Connect to Mongoose database
	try {
		await Mongoose.connect(appConfig.MONGO_URL, {
			useNewUrlParser: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		});
		console.log('DB connected successfully');
		// Start the server
		App.listen(Port, () => {
			console.log(`Server running on port ${Port}`);
		});
	} catch (e) {
		console.log('Problem while connecting to DB');
	}
})();
