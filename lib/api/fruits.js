const { InfluxDB } = require('@influxdata/influxdb-client');

const influx = new InfluxDB({
  url: 'http://localhost:8086',
  token: 'your_influxdb_token',
});
const queryApi = influx.getQueryApi('your_org');

app.get('/api/sensor-data', async (req, res) => {
  try {
    const fluxQuery = `from(bucket: "your_bucket")
      |> range(start: -1h)  // Adjust the time range as needed
      |> filter(fn: (r) => r._measurement == "signal_strength")`;

    const results = [];
    await queryApi.queryRows(fluxQuery, {
      next(row) {
        const values = row.split(',');
        results.push({
          signal_strength: parseFloat(values[0]),
          longitude: parseFloat(values[1]),
          latitude: parseFloat(values[2]),
          speed: parseFloat(values[3]),
        });
      },
      error(error) {
        console.error('Error querying InfluxDB:', error);
        res.status(500).send('Internal Server Error');
      },
      complete() {
        res.json(results);
      },
    });
  } catch (err) {
    console.error('Failed to execute query:', err);
    res.status(500).send('Internal Server Error');
  }
});
