import { Router } from 'express';

import { createWaitlistEntry } from '../controllers/waitlist';

const router = Router();

router.post('/', createWaitlistEntry);

export default router;
