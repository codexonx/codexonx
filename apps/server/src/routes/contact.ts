import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { createContactRequest } from '../controllers/contact';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Çok fazla talep gönderdiniz. Lütfen birkaç dakika sonra tekrar deneyin.',
  },
});

router.post('/', contactLimiter, createContactRequest);

export default router;
