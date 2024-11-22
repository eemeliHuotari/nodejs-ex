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
      next(row) {
        const values = row.split(',');
        result.push({
          signal_strength: parseFloat(values[0]),
          longitude: parseFloat(values[1]),
          latitude: parseFloat(values[2]),
          speed: parseFloat(values[3]),
        });
      },
      error(error) {
        console.error('Error querying InfluxDB:', error);
      },
      complete() {
        console.log('Query completed');
        console.log(result);
      },
    });
  } catch (err) {
    console.error('Failed to execute query:', err);
  }
}

const fluxQuery = `from(bucket: "car-data")
  |> range(start: -1h)  // Adjust the time range as needed
  |> filter(fn: (r) => r._measurement == "sensor_data")`;

query(fluxQuery);
