const dotenv = require('dotenv');
const express = require('express');

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.listen(PORT, () =>
    console.log(`Server listening on port ${PORT}.`)
);
