import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from '../controllers/authController';

const router = Router();
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 3, // Límite de 3 peticiones por IP
  message: { error: 'Demasiados intentos, por favor intenta de nuevo después de 15 minutos' },
});

router.post('/forgot-password', forgotPasswordLimiter, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export default router;
