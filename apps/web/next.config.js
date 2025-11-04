/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

// Monaco Editor webpack yapılandırması
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const withTM = require('next-transpile-modules')(['monaco-editor']);

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@codexonx/ui'],
  i18n,
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
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
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

    return config;
  },
};

module.exports = nextConfig;
