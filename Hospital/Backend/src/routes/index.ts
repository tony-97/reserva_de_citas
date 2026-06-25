import { Router } from 'express';
import pacienteRoutes from './pacienteRoutes';
import citaRoutes from './citaRoutes';
import medicoRoutes from './medicoRoutes';
import especialidadRoutes from './especialidadRoutes';
import authRoutes from './authRoutes';
import adminRoutes from './adminRoutes';
import turnosRoutes from './turnosRoutes';
import pagosRoutes from './pagosRoutes';
import reportRoutes from './reportRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/pacientes', pacienteRoutes);
router.use('/citas', citaRoutes);
router.use('/medicos', medicoRoutes);
router.use('/especialidades', especialidadRoutes);
router.use('/admin', adminRoutes);
router.use('/turnos', turnosRoutes);
router.use('/pagos', pagosRoutes);
router.use('/admin/reportes', reportRoutes);

export default router;
