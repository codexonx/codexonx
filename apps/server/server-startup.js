/**
 * Codexonx Server Startup Helper
 * 
 * Bu script, TypeScript derleme hatalarından bağımsız olarak
 * Express sunucusunu başlatmak için kullanılır.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Environment variables
const PORT = process.env.PORT || 5002;

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Ana sayfa için HTML içeriği
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Codexonx API Sunucusu</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background: #f5f5f5;
          color: #333;
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
        }
        header {
          background: #1e40af;
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        h1 {
          margin: 0;
        }
        .card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .endpoint {
          background: #f0f9ff;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 10px;
          border-left: 4px solid #1e40af;
          font-family: monospace;
        }
        .badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-left: 10px;
        }
        .get { background: #dbeafe; color: #1e40af; }
        .post { background: #dcfce7; color: #166534; }
        footer {
          text-align: center;
          margin-top: 30px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>Codexonx API Sunucusu</h1>
        <p>Versiyon 1.0.0</p>
      </header>
      
      <div class="card">
        <h2>Sistem Durumu</h2>
        <p>Sunucu şu anda aktif ve çalışıyor. Zaman: ${new Date().toLocaleString('tr-TR')}</p>
        <div class="endpoint">
          GET /health <span class="badge get">GET</span>
        </div>
      </div>
      
      <div class="card">
        <h2>Kullanılabilir Endpointler</h2>
        
        <h3>Projeler</h3>
        <div class="endpoint">
          GET /api/projects <span class="badge get">GET</span>
        </div>
        <div class="endpoint">
          GET /api/projects/:id <span class="badge get">GET</span>
        </div>
        
        <h3>Abonelikler</h3>
        <div class="endpoint">
          GET /api/subscriptions <span class="badge get">GET</span>
        </div>
        
        <h3>Ödemeler</h3>
        <div class="endpoint">
          GET /api/payments/prices <span class="badge get">GET</span>
        </div>
      </div>
      
      <footer>
        &copy; 2025 Codexonx Platform - Tüm hakları saklıdır.
      </footer>
    </body>
    </html>
  `);
});

// Health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Codexonx API sunucusu çalışıyor',
    version: '1.0.0'
  });
});

// Mock data for testing
const mockProjects = [
  {
    id: '1',
    name: 'E-ticaret Platformu',
    description: 'B2B ve B2C için tam kapsamlı e-ticaret çözümü',
    apiKey: 'api_key_1',
    status: 'active',
    createdAt: new Date('2025-10-01').toISOString()
  },
  {
    id: '2',
    name: 'Analitik Dashboard',
    description: 'Müşteri davranışlarını izlemek için gerçek zamanlı analitik dashboard',
    apiKey: 'api_key_2',
    status: 'pending',
    createdAt: new Date('2025-10-15').toISOString()
  },
  {
    id: '3',
    name: 'Mobil Uygulama',
    description: 'iOS ve Android için hibrit mobil uygulama',
    apiKey: 'api_key_3',
    status: 'completed',
    createdAt: new Date('2025-09-20').toISOString()
  }
];

// API routes
app.get('/api/projects', (req, res) => {
  res.status(200).json({
    success: true,
    data: mockProjects
  });
});

app.get('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const project = mockProjects.find(p => p.id === id);
  
  if (!project) {
    return res.status(404).json({
      success: false,
      error: 'Project not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: project
  });
});

// Mock subscription data
const mockSubscriptions = [
  {
    id: '1',
    status: 'ACTIVE',
    startDate: new Date('2025-10-01').toISOString(),
    endDate: new Date('2026-10-01').toISOString(),
    plan: {
      id: '1',
      name: 'Pro',
      description: 'Professional plan with advanced features',
      price: 29.99,
      currency: 'USD',
      interval: 'MONTH'
    }
  }
];

// Subscription routes
app.get('/api/subscriptions', (req, res) => {
  res.status(200).json({
    success: true,
    data: mockSubscriptions
  });
});

// Payment routes - Stripe config stub
app.get('/api/payments/prices', (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      {
        id: 'price_1',
        active: true,
        currency: 'usd',
        unit_amount: 2999,
        product: {
          id: 'prod_1',
          name: 'Pro Plan',
          description: 'Professional plan with advanced features'
        }
      },
      {
        id: 'price_2',
        active: true,
        currency: 'usd',
        unit_amount: 9999,
        product: {
          id: 'prod_2',
          name: 'Enterprise Plan',
          description: 'Enterprise plan with all features and priority support'
        }
      }
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ┌─────────────────────────────────────────────────────┐
  │                                                     │
  │   Codexonx API Sunucusu çalışıyor                  │
  │                                                     │
  │   🚀 Port: ${PORT}                                   │
  │   🔗 Local URL: http://localhost:${PORT}              │
  │                                                     │
  │   🛡️  Sağlık kontrolü: http://localhost:${PORT}/health │
  │   📊 API: http://localhost:${PORT}/api/projects        │
  │                                                     │
  └─────────────────────────────────────────────────────┘
  `);
});
