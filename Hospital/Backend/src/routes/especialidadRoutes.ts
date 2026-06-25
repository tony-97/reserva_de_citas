import { Router } from 'express';
import { especialidadController } from '../controllers/especialidadController';

const router = Router();
router.get('/', especialidadController.getAll);
export default router;
