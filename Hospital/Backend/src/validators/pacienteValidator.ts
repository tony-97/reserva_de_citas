import { Request, Response, NextFunction } from 'express';

export function validatePaciente(req: Request, res: Response, next: NextFunction) {
  const { nombres, apellidos, dni, telefono, correo } = req.body;
  if (!nombres || !apellidos || !dni || !telefono || !correo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  if (dni.length !== 8 || !/^\d+$/.test(dni)) {
    return res.status(400).json({ error: 'El DNI debe tener exactamente 8 dígitos numéricos' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return res.status(400).json({ error: 'Correo electrónico inválido' });
  }
  next();
}
