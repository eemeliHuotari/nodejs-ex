const express = require('express');
const router = express.Router();
const db = require('../api/fruits');


router.get('/', async (req, res) => {
  try {
    const fluxQuery = `
      from(bucket: "your-bucket")
        |> range(start: -1d)
        |> filter(fn: (r) => r["_measurement"] == "singal_strength")
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    `;

    const result = await db.query(fluxQuery);

    console.log('Query result:', result);

    if (Array.isArray(result)) {
      res.json(result);
    } else {
      res.status(500).send('Unexpected data format from InfluxDB');
    }
  } catch (err) {
    console.error('Error fetching fruits from InfluxDB:', err);
    res.status(500).send('Error fetching fruits');
  }
});

module.exports = router;
