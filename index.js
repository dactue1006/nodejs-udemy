const morgan = require('morgan');
const winston = require('winston');
const express = require('express');
const app = express();

// config joi validation
require('./startup/validation')();
// error handling and logging
require('./startup/logging')();

// config private key
require('./startup/config')();

// use module
app.use(express.json());
app.use(morgan('dev'));

// routes
require('./startup/routes')(app);

// database
require('./startup/db')();

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));