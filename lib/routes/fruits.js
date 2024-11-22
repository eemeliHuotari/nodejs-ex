'use strict';

const logger = require('../../logger.js');

const express = require('express');
/* eslint new-cap: "warn" */
const router = express.Router();

const validations = require('../validations');
const signal = require('../api/signal');

router.get(
  '/singal',
  asyncHandler(async (req, res) => {
    const results = await signal.find();
    res.json(results.rows);
  })
);
  

module.exports = router;
