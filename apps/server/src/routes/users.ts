import { Router } from 'express';

import {
  getMe,
  updateMe,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/users';
import { authenticate, restrictTo } from '../middlewares/auth';

const router = Router();

// User routes
router.use(authenticate);

router.get('/me', getMe);
router.patch('/me', updateMe);

// Admin only routes
router.use(restrictTo('ADMIN'));

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
