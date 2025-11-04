import express from 'express';
import {
  register,
  login,
  logout,
  resetPassword,
  forgotPassword,
  verifyEmail,
} from '../controllers/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-email/:token', verifyEmail);

export default router;
