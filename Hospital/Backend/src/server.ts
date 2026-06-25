import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import pinoHttp from 'pino-http';
import apiRoutes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = process.env.FRONTEND_URL 
  ? [process.env.FRONTEND_URL] 
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(pinoHttp({ logger }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Límite de 5 peticiones por IP por ventana
  message: { error: 'Demasiados intentos de inicio de sesión, por favor intenta de nuevo en 15 minutos.' }
});

app.use('/api/auth/login', loginLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hospital API is running on port ' + port });
});

app.use('/api', apiRoutes);

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});
