import { Router } from 'express';
import { turnosController } from '../controllers/turnosController';

const router = Router();

router.get('/disponibles', turnosController.disponibles);

export default router;
