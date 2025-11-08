import { Router } from 'express';

import {
  register,
  login,
  logout,
  resetPassword,
  forgotPassword,
  verifyEmail,
  me,
} from '../controllers/auth';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.get('/me', authenticate, me);

export default router;
