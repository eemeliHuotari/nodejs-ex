const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const fluxQuery = `
      from(bucket: "car-data")
        |> range(start: -1d)
        |> filter(fn: (r) => r["_measurement"] == "signal_strength")
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    `;

    const result = await db.query(fluxQuery);
    res.json(result);
  } catch (err) {
    console.error('Error fetching fruits from InfluxDB:', err);
    res.status(500).send('Error fetching fruits');
  }
});

module.exports = router;
