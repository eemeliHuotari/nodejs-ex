const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const fluxQuery = `
      from(bucket: "your-bucket")
        |> range(start: -30d) // Get data from the last 30 days (or modify as needed)
        |> filter(fn: (r) => r["_measurement"] == "fruit")
        |> filter(fn: (r) => r["_field"] == "stock" or r["_field"] == "name")
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
