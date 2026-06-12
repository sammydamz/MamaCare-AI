fetch('https://mamacare-web-production.up.railway.app/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'sarac@kbth.com', password: 'demo123' })
}).then(r => {
  console.log(r.status);
  return r.text();
}).then(console.log).catch(console.error);
