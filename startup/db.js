const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function() {
  mongoose.connect('mongodb://localhost/vidly', { 
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => winston.info('Connected to MongoDB...'))
}