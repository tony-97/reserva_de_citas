import { Router } from 'express';
import { reportController } from '../controllers/reportController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/pdf', reportController.exportPdf);
router.get('/csv', reportController.exportCsv);

export default router;
