fetch('https://api.alquran.cloud/v1/edition?format=audio').then(r=>r.json()).then(d=>console.log(d.data.map(e=>e.identifier).join('\n')))
