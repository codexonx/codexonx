import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  regenerateApiKey,
} from '../controllers/projects';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// All project routes require authentication
router.use(authenticate);

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/regenerate-api-key', regenerateApiKey);

export default router;
