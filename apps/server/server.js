const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });

  if (req.url === '/health') {
    return res.end(
      JSON.stringify({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'Test sunucu aktif',
      })
    );
  }

  if (req.url === '/api/projects') {
    return res.end(
      JSON.stringify({
        status: 'success',
        data: [
          { id: 1, title: 'Proje 1', description: 'Test projesi 1', status: 'active' },
          { id: 2, title: 'Proje 2', description: 'Test projesi 2', status: 'pending' },
          { id: 3, title: 'Proje 3', description: 'Test projesi 3', status: 'completed' },
        ],
      })
    );
  }

  return res.end(
    JSON.stringify({
      status: 'success',
      message: 'Codexonx API sunucusu çalışıyor',
      endpoints: ['/health', '/api/projects'],
    })
  );
});

const PORT = process.env.PORT || 4001;

server.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
