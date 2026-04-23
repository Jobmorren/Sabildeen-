import https from 'https';

https.get('https://www.mp3quran.net/api/v3/reciters?language=ar', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const matches = json.reciters.filter(r => 
      r.name.includes('ياسر') || r.name.includes('الدوسري')
    );
    console.log(JSON.stringify(matches.map(m=>({id:m.id, name:m.name, server:m.moshaf[0].server})), null, 2));
  });
}).on('error', e => console.error(e));
