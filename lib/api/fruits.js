const { InfluxDB } = require('@influxdata/influxdb-client');

const url = 'https://influxdb-connecticar.2.rahtiapp.fi/';
const token = 'aJasLm8EeO76vCC-HmkXlIo0Tdl2GOlwrMMEj1owH2h1y-K1KnbED3HUjI7v6_S9DIAiIsHI7HPgwmNMO10KNA==';
const org = 'connecticar';
const bucket = 'car-data';

const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

const query = `
from(bucket: "${bucket}")
  |> range(start: -1d)
  |> filter(fn: (r) => r._measurement == "signal_strength")
  |> filter(fn: (r) => r._field == "value")
`;

async function queryAndProcessData(callback) {
  console.log('Querying data...');

  return new Promise((resolve, reject) => {
    const results = [];
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const parsed = tableMeta.toObject(row);
        const data = {
          signal_strength: parsed._value || 0,
          longitude: parseFloat(parsed.longitude || 0.0),
          latitude: parseFloat(parsed.latitude || 0.0),
          speed: parseFloat(parsed.speed || 0),
        };
        results.push(data);
      },
      error(err) {
        console.error('Error querying InfluxDB:', err);
        reject(err);
      },
      complete() {
        console.log('Query complete. Results:', results);
        if (callback) {
          callback(results);
        }
        resolve(results);
      },
    });
  });
}

module.exports = { queryAndProcessData };
