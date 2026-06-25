import { Router } from 'express';
import { citaController } from '../controllers/citaController';
import { validateCita } from '../validators/citaValidator';

const router = Router();

router.get('/', citaController.getAll);
router.post('/', validateCita, citaController.create);
router.put('/:id', citaController.update);
router.delete('/:id', citaController.delete);

export default router;
