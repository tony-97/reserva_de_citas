import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/medicos', adminController.listMedicos);
router.post('/medicos', adminController.createMedico);
router.put('/medicos/:id', adminController.updateMedico);
router.delete('/medicos/:id', adminController.deleteMedico);

router.get('/pacientes', adminController.listPacientes);
router.post('/pacientes', adminController.createPaciente);
router.put('/pacientes/:id', adminController.updatePaciente);
router.delete('/pacientes/:id', adminController.deletePaciente);

router.get('/especialidades', adminController.listEspecialidades);
router.post('/especialidades', adminController.createEspecialidad);
router.delete('/especialidades/:id', adminController.deleteEspecialidad);

export default router;
