const express = require('express');
const router = express.Router();
const db = require('../api/fruits');


router.get('/', async (req, res) => {
   try {
    res.json(latestData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

module.exports = router;
