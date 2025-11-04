/**
 * Basit Express Sunucu Testi
 */

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5001;

// CORS ayarları - güvenlik için production'da domain'i belirtin
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://codexonx.com', 'https://www.codexonx.com']
        : '*',
  })
);

// JSON body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/version', (req, res) => {
  res.json({ version: '1.0.0', name: 'CodeXONX API' });
});

// Örnek API endpoint
app.get('/api/projects', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Web Uygulaması',
      description: 'React ve Next.js ile geliştirilmiş web uygulaması',
      language: 'typescript',
    },
    {
      id: 2,
      name: 'API Servisi',
      description: 'Node.js ve Express ile REST API',
      language: 'javascript',
    },
    {
      id: 3,
      name: 'ML Algoritması',
      description: 'Python ile makine öğrenimi modeli',
      language: 'python',
    },
  ]);
});

// Basit bir endpoint ekleyelim
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Basit Express Sunucusu</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
          color: #333;
        }
        .container {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }
        h1 {
          color: #1e40af;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Basit Express Sunucu</h1>
        <p>Bu sunucu şu anda çalışıyor: <strong>${PORT}</strong> numaralı portta</p>
        <p>Zaman: ${new Date().toLocaleString('tr-TR')}</p>
      </div>
    </body>
    </html>
  `);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`API endpoint: http://localhost:${PORT}/api/projects`);
});
