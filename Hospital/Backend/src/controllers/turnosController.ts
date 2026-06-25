import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

const DIAS_LABORALES = [1, 2, 3, 4, 5]; // Lunes=1, Viernes=5
const HORA_INICIO = 8;  // 8:00 AM
const HORA_FIN = 14;    // 2:00 PM
const INTERVALO_MIN = 30;

function generarSlots(fecha: string): string[] {
  const slots: string[] = [];
  for (let h = HORA_INICIO; h < HORA_FIN; h++) {
    for (let m = 0; m < 60; m += INTERVALO_MIN) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return slots;
}

export const turnosController = {
  async disponibles(req: Request, res: Response, next: NextFunction) {
    try {
      const medicoId = Number(req.query.medicoId);
      const fechaStr = req.query.fecha as string;

      if (!medicoId || !fechaStr) {
        return res.status(400).json({ error: 'medicoId y fecha son obligatorios.' });
      }

      const fecha = new Date(fechaStr + 'T00:00:00Z');
      const diaSemana = fecha.getUTCDay();

      if (!DIAS_LABORALES.includes(diaSemana)) {
        return res.json({ fecha: fechaStr, slots: [] });
      }

      const medicoExiste = await prisma.medico.findUnique({ where: { id: medicoId } });
      if (!medicoExiste) {
        return res.status(404).json({ error: 'Médico no encontrado.' });
      }

      const TodosLosSlots = generarSlots(fechaStr);

      const citasOcupadas = await prisma.cita.findMany({
        where: {
          medicoId,
          fecha: {
            gte: new Date(fechaStr + 'T00:00:00Z'),
            lt: new Date(fechaStr + 'T23:59:59Z')
          },
          estado: { not: 'cancelada' }
        },
        select: { hora: true }
      });

      const horasOcupadas = new Set(citasOcupadas.map(c => c.hora));
      const slotsDisponibles = TodosLosSlots.filter(s => !horasOcupadas.has(s));

      return res.json({ fecha: fechaStr, slots: slotsDisponibles });

    } catch (e) {
      next(e);
    }
  }
};
