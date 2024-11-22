'use strict';

const{InfluxDB} = require('@influxdata/influxdb-client');

const INFLUX_URL = 'https://influxdb-connecticar.2.rahtiapp.fi/';
const TOKEN = 'aJasLm8EeO76vCC-HmkXlIo0Tdl2GOlwrMMEj1owH2h1y-K1KnbED3HUjI7v6_S9DIAiIsHI7HPgwmNMO10KNA==';
const ORG = 'connecticar'
const BUCKET = 'car-data'

const influxClient = new influxDB({url: INFLUX_URL, token: TOKEN});
const queryAPI = influxClient.getQueryApi(ORG);

async function find() {
  const query =  `
    from(bucket: "car-data")
      |> range(start: -1h)
      |> filter(fn: (r) => r._measurement == "signal_strength")
      |> filter(fn: (r) => r._field == "value")
  `;
  return queryApi.collectRows(query);
}


module.exports = {
  find
};
