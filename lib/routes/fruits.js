'use strict';
const asyncHandler = require('express-async-handler');

const logger = require('../../logger.js');

const express = require('express');
/* eslint new-cap: "warn" */
const router = express.Router();

const validations = require('../validations');
const fruits = require('../api/fruits');

router.get(
  '/fruits',
  asyncHandler(async (req, res) => {
    const results = await fruits.find();
    res.json(results);
  })
);
  

module.exports = router;
