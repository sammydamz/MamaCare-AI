fetch('http://localhost:5000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'sarac@kbth.com', password: 'demo123' })
}).then(r => r.json()).then(console.log).catch(console.error);
