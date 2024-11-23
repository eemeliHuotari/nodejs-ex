async function queryAndProcessData(returnCallback) {
  console.log('Starting the query loop...');
  try {
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 10000)); 

      const results = [];
      console.log('Querying data...');
      const rawResults = await new Promise((resolve, reject) => {
        const tempResults = [];
        queryApi.queryRows(query, {
          next(row, tableMeta) {
            const parsed = tableMeta.toObject(row);
            const data = {
              signal_strength: parseFloat(parsed._value) || 0,
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
            resolve(tempResults);
          },
        });
      });
      results.push(...rawResults);

      if (returnCallback) {
        returnCallback(results);
      } else {
        console.log('Results:', results);
      }
    }
  } catch (error) {
    console.error('Error during query loop:', error);
  } finally {
    influxDB.close();
    console.log('InfluxDB client closed.');
  }
}
queryAndProcessData(data => {
  console.log('Returned Data:', data);
});
