import express from 'express';
import { 
  createCustomer,
  createPaymentIntent,
  getPrices,
  handleWebhook
} from '../controllers/payments';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// Webhook endpoints don't need authentication
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), handleWebhook);

// All other payment routes require authentication
router.use(authenticate);

router.post('/customers', createCustomer);
router.post('/payment-intents', createPaymentIntent);
router.get('/prices', getPrices);

export default router;
