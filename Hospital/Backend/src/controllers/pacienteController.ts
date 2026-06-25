import { Request, Response, NextFunction } from 'express';
import { pacienteService } from '../services/pacienteService';

export const pacienteController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await pacienteService.getAll(page, limit);
      res.json(result);
    } catch (e) { next(e); }
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const paciente = await pacienteService.getById(Number(req.params.id));
      if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
      res.json(paciente);
    } catch (e) { next(e); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const paciente = await pacienteService.create(req.body);
      res.status(201).json(paciente);
    } catch (e) { next(e); }
  }
};
