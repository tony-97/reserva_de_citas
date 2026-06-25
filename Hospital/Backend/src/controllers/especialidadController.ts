import { Request, Response, NextFunction } from 'express';
import { especialidadService } from '../services/especialidadService';

export const especialidadController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const especialidades = await especialidadService.getAll();
      res.json(especialidades);
    } catch (e) { next(e); }
  }
};
