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
        result.push(row);
      },
      error(error) {
        console.error('Error querying InfluxDB:', error);
      },
      complete() {
        console.log('Query completed, result:', result);
      },
    });
  } catch (error) {
    console.error('Error during query execution:', error);
    throw error;
  }

  return result;
}

module.exports = {
  query,
};
