import cors from 'cors';
import { config } from 'dotenv';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler } from './middlewares/errorHandler';
import aiCodeRoutes from './routes/ai-code.routes';
import authRoutes from './routes/auth';
import contactRoutes from './routes/contact';
import paymentRoutes from './routes/payments';
import projectRoutes from './routes/projects';
import subscriptionRoutes from './routes/subscriptions';
import userRoutes from './routes/users';
import waitlistRoutes from './routes/waitlist';
import { logger } from './utils/logger';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting geçici olarak devre dışı bırakıldı (TypeScript uyumluluk sorunları nedeniyle)
// TODO: Rate limiter'ı düzelttikten sonra ekle

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiCodeRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
