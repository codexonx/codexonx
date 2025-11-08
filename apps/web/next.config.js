/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

// Monaco Editor webpack yapılandırması
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const withTM = require('next-transpile-modules')(['monaco-editor']);

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@codexonx/ui'],
  i18n,
  async headers() {
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.vercel-insights.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://api.codexonx.com http://localhost:3001 ws://localhost:3000",
      "object-src 'none'",
      "frame-ancestors 'self'",
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspDirectives,
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.API_URL || 'http://localhost:3001/api/:path*',
      },
    ];
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  experimental: {
    instrumentationHook: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config, { isServer, dev }) => {
    // Monaco Editor webpack yapılandırması
    if (!isServer) {
      config.plugins.push(
        new MonacoWebpackPlugin({
          languages: ['javascript', 'typescript', 'html', 'css', 'json', 'python', 'markdown'],
          filename: 'static/[name].worker.js',
        })
      );
    }

    // AI modelleri için büyük JSON modülleri optimize etme
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });

    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'framer-motion': require.resolve('framer-motion'),
    };

    return config;
  },
};

module.exports = nextConfig;
