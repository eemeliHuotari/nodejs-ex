const { InfluxDB } = require('@influxdata/influxdb-client');

const token = 'aJasLm8EeO76vCC-HmkXlIo0Tdl2GOlwrMMEj1owH2h1y-K1KnbED3HUjI7v6_S9DIAiIsHI7HPgwmNMO10KNA==';
const org = 'connecticar';
const bucket = 'car-data';
const url = 'https://influxdb-connecticar.2.rahtiapp.fi/';

const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

async function query(queryString) {
  const results = [];
  console.log('Starting query...');

  return new Promise((resolve, reject) => {
    queryApi.queryRows(queryString, {
      next(row, tableMeta) {
        const parsed = tableMeta.toObject(row);
        results.push({
          time: parsed._time,
          signal_strength: parsed.signal_strength || null,
          longitude: parsed.longitude || null,
          latitude: parsed.latitude || null,
          speed: parsed.speed || null,
        });
      },
      error(error) {
        console.error('Error querying InfluxDB:', error);
        reject(error);
      },
      complete() {
        console.log('Query completed successfully');
        resolve(results);
      },
    });
  });
}

const fluxQuery = `
  from(bucket: "${bucket}")
    |> range(start: -20h)  // Adjust the time range as needed
    |> filter(fn: (r) => r._measurement == "sensor_data")
    |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")`;

query(fluxQuery)
  .then(data => {
    console.log('Query Results:', data);
  })
  .catch(err => {
    console.error('Failed to execute query:', err);
  });
