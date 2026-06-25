import { Request, Response, NextFunction } from 'express';

export function validateCita(req: Request, res: Response, next: NextFunction) {
  const { pacienteId, medicoId, especialidadId, fecha, hora } = req.body;
  if (!pacienteId || !medicoId || !especialidadId || !fecha || !hora) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  const inputDate = new Date(fecha);
  if (isNaN(inputDate.getTime())) {
    return res.status(400).json({ error: 'Formato de fecha inválido' });
  }
  if (inputDate < new Date(new Date().setHours(0,0,0,0))) {
    return res.status(400).json({ error: 'La fecha no puede ser en el pasado' });
  }
  next();
}
