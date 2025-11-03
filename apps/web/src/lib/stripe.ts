import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16', // En güncel API versiyonu
  appInfo: {
    name: 'CodeXONX Platform',
    version: '1.0.0',
  },
});
