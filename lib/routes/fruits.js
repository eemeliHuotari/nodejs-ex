const express = require('express');
const router = express.Router();
const db = require('../api/fruits');


router.get('/fruits', async (req, res) => {
  try {
    const fluxQuery = `
      from(bucket: "car-data")
        |> range(start: -1d)
        |> filter(fn: (r) => r._measurement == "signal_strength")
        |> filter(fn: (r) => r._field == "value")
      `;

    const result = await db.query(fluxQuery);

    console.log('Query result:', result);

    if (Array.isArray(results)) {
      res.json(results);
    } else {
      logger.error('Unexpected format from InfluxDB query:', results);
      res.status(500).send({ error: 'Unexpected data format from InfluxDB' });
    }
  } catch (error) {
    logger.error('Error querying InfluxDB:', error);
    res.status(500).send({ error: 'Failed to fetch fruits data' });
  }
});

module.exports = router;
