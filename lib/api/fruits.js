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


const dataStore = { latestData: [] };


async function queryAndUpdateData() {
  console.log('Starting the query loop...');
  try {
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 10000));

      console.log('Querying data...');
      const tempResults = [];

      await new Promise((resolve, reject) => {
        queryApi.queryRows(query, {
          next(row, tableMeta) {
            const parsed = tableMeta.toObject(row);
            const data = {
              signal_strength: parsed._value || 0,
              longitude: parseFloat(parsed.longitude) || 0.0,
              latitude: parseFloat(parsed.latitude) || 0.0,
              speed: parseFloat(parsed.speed) || 0,
            };
            tempResults.push(data);
          },
          error(err) {
            reject(err);
          },
          complete() {
            resolve();
          },
        });
      });

      dataStore.latestData = tempResults;
      console.log('Updated latest data:', dataStore.latestData);
    }
  } catch (error) {
    console.error('Error during query loop:', error);
  } finally {
    influxDB.close();
    console.log('InfluxDB client closed.');
  }
}


queryAndUpdateData();

module.exports = dataStore;
