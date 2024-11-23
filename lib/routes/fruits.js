const express = require('express');
const router = express.Router();
const db = require('../api/fruits');


router.get('/api/fruits', async (req, res) => {
  try {
    const fluxQuery = `
      from(bucket: "your-bucket")
      from(bucket: "car-data")
        |> range(start: -1d)
        |> filter(fn: (r) => r._measurement == "signal_strength")
        |> filter(fn: (r) => r._field == "value")
      `;

    const result = await db.query(fluxQuery);

    console.log('Query result:', result);

    if (Array.isArray(result)) {
      const formattedResult = result.map((row) => ({
        signal_strength: row.signal_strength || 0,
        longitude: row.longitude || 0,
        latitude: row.latitude || 0,
        speed: row.speed || 0,
      }));

      res.json(formattedResult);
    } else {
      console.error('Unexpected data format from InfluxDB');
      res.status(500).send('Unexpected data format from InfluxDB');
    }
  } catch (err) {
    console.error('Error fetching fruits from InfluxDB:', err.message);
    res.status(500).send('Error fetching fruits');
  }
});

module.exports = router;
