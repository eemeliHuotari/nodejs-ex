const { InfluxDB } = require('@influxdata/influxdb-client');

const client = new InfluxDB({ url: 'http://localhost:8086', token: 'your_token' });
const queryApi = client.getQueryApi('your_org');

app.get('/api/fruits', async (req, res) => {
  try {
    const query = `from(bucket: "your_bucket") |> range(start: -1h) |> filter(fn: (r) => r["_measurement"] == "fruit")`;
    const fruits = [];

    await queryApi.queryRows(query, {
      next(row, tableMeta) {
        const fruit = tableMeta.toObject(row);
        fruits.push(fruit);
      },
      error(error) {
        console.error(error);
        res.status(500).send('Error querying InfluxDB');
      },
      complete() {
        res.json(fruits);
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
