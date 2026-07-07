import { Request, Response, NextFunction } from 'express';
import { citaService } from '../services/citaService';

export const citaController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { pacienteId, medicoId } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filtros: any = {};
      if (pacienteId) filtros.pacienteId = Number(pacienteId);
      if (medicoId) filtros.medicoId = Number(medicoId);
      const result = await citaService.getAll(filtros, page, limit);
      res.json(result);
    } catch (e) { next(e); }
  },
  async getToday(req: Request, res: Response, next: NextFunction) {
    try {
      const medicoId = Number(req.query.medicoId);
      if (!medicoId) return res.status(400).json({ error: 'medicoId es requerido' });
      const result = await citaService.getTodayByMedico(medicoId);
      // Devolvemos una estructura consistente `{ data: [...] }` similar a otros endpoints
      res.json({ data: result });
    } catch (e) { next(e); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const cita = await citaService.create(req.body);
      res.status(201).json(cita);
    } catch (e) { next(e); }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const cita = await citaService.update(Number(req.params.id), req.body);
      res.json(cita);
    } catch (e) { next(e); }
  },
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await citaService.delete(Number(req.params.id));
      res.json({ success: true });
    } catch (e) { next(e); }
  }
};
