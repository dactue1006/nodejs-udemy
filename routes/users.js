const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
const _ = require('lodash');

router.get('/me', auth, async (req, res) => {
  console.log(req.user);
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already taken");

  user = new User({
    ...req.body
  })
  const salt =  await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  user = await user.save();
  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
})

// how to generate token by user itself: in OOP use Expert information principle

module.exports = router;