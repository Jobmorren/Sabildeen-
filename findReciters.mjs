import https from 'https';

https.get('https://api.alquran.cloud/v1/edition?format=audio', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const matches = json.data.map(d => ({id: d.identifier, name: d.englishName}));
    console.log(JSON.stringify(matches, null, 2));
  });
});
