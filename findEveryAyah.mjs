import https from 'https';

https.get('https://everyayah.com/data/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const lines = data.split('\n').filter(line => 
      line.toLowerCase().includes('ahmad') ||
      line.toLowerCase().includes('ahmed') ||
      line.toLowerCase().includes('talab') ||
      line.toLowerCase().includes('bin') ||
      line.toLowerCase().includes('hameed')
    );
    console.log(lines.join('\n'));
  });
});
