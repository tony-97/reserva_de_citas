import { Router } from 'express';
import { medicoController } from '../controllers/medicoController';

const router = Router();
router.get('/', medicoController.getAll);
export default router;
