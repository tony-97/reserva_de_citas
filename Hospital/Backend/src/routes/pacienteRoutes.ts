import { Router } from 'express';
import { pacienteController } from '../controllers/pacienteController';
import { validatePaciente } from '../validators/pacienteValidator';

const router = Router();

router.get('/', pacienteController.getAll);
router.get('/:id', pacienteController.getById);
router.post('/', validatePaciente, pacienteController.create);

export default router;
