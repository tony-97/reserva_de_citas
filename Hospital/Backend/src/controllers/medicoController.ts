import { Request, Response, NextFunction } from 'express';
import { medicoService } from '../services/medicoService';

export const medicoController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { especialidadId } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await medicoService.getAll(especialidadId ? Number(especialidadId) : undefined, page, limit);
      res.json(result);
    } catch (e) { next(e); }
  }
};
