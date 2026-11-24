const https = require('https');

https.get('https://reclaim-india.vercel.app', (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers x-vercel-id:', res.headers['x-vercel-id']);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('HTML Length:', data.length);
    const scriptMatches = data.match(/src="(\/_next\/static\/[^"]+)"/g);
    console.log('Scripts:', scriptMatches);
  });
}).on('error', err => {
  console.error('Error:', err.message);
});
