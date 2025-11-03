import express from 'express';
import { 
  getSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  checkActiveSubscription
} from '../controllers/subscriptions';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// All subscription routes require authentication
router.use(authenticate);

// Kullanıcı abonelikleri yönetimi
router.get('/', getSubscriptions);
router.get('/active', checkActiveSubscription);
router.get('/:id', getSubscription);
router.post('/', createSubscription);
router.put('/:id', updateSubscription);
router.delete('/:id', cancelSubscription);

export default router;
