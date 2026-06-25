import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({ error: 'Ya existe un registro con ese valor único (DNI, correo o colegiatura duplicado).' });
      case 'P2025':
        return res.status(404).json({ error: 'Registro no encontrado.' });
      case 'P2003':
        return res.status(400).json({ error: 'El registro relacionado no existe (ej. especialidad inválida).' });
      default:
        return res.status(400).json({ error: `Error de base de datos (código: ${err.code}).` });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ error: 'Datos inválidos enviados a la base de datos.' });
  }

  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'JSON mal formado en la solicitud.' });
  }

  const message = err instanceof Error ? err.message : 'Error interno del servidor.';
  logger.error({ err }, `[ErrorHandler]: ${message}`);
  return res.status(500).json({ error: 'Error interno del servidor.' });
}
