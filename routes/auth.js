const config = require('config');
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const isvalidPassword = await bcrypt.compare(req.body.password, user.password);
  console.log(isvalidPassword);
  if (!isvalidPassword) return res.status(400).send("Invalid password");

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(token);
})

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required()
  }
  return Joi.validate(req, schema);
}

module.exports = router;