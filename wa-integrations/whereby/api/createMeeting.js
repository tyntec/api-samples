const axios = require("axios");
const sendMessage = require('../utils/sendMessage');
const { mockedNumbers } = require('../utils/mocks');
const { appConfig } = require('../config/appConfig');

module.exports = async (request, response) => {
  const start_date = request.body.start_date
  const end_date = request.body.end_date
  const whereByApiHeaders = { 
    headers: { 
      Authorization: `Bearer ${appConfig.wherebyApiKey}`, 
      "Content-Type": "application/json" 
    } 
  };

  if(!start_date || !end_date) {
    response.status(500).send("Start and end time not provided.");
    return;
  }

  try {
    const data = {
      startDate: start_date,
      endDate: end_date
    };  

    const apiResponse = await axios.post(
      "https://api.whereby.dev/v1/meetings",
      data,
      whereByApiHeaders
    );

    const phoneNumbers = request.body.phone_numbers && request.body.phone_numbers.split(",");

    if (phoneNumbers) {
      await sendMessage(phoneNumbers, apiResponse.data.roomUrl);
      response.status(201).send(`Meeting ${apiResponse.data.roomUrl} successfully created and messages sent!`);

    } else {
      await sendMessage(mockedNumbers, apiResponse.data.roomUrl);
      response.status(201).send(`Meeting ${apiResponse.data.roomUrl} and messages sent!`);
    }

  } catch (error) {
    response.status(500).send(error);
  }
};
