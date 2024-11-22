const { InfluxDB } = require('@influxdata/influxdb-client');

const token = 'aJasLm8EeO76vCC-HmkXlIo0Tdl2GOlwrMMEj1owH2h1y-K1KnbED3HUjI7v6_S9DIAiIsHI7HPgwmNMO10KNA==';
const org = 'connecticar';
const bucket = 'car-data';
const url = 'https://influxdb-connecticar.2.rahtiapp.fi/';

const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

async function query(queryString) {
  const result = [];
  try {
    await queryApi.queryRows(queryString, {
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
