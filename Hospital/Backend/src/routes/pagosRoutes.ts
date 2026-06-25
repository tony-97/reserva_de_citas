import { Router } from 'express';
import { pagosController } from '../controllers/pagosController';

const router = Router();

router.post('/checkout', pagosController.checkout);

export default router;
