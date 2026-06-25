import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

export const pagosController = {
  async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const { citaId, metodoPago } = req.body;

      if (!citaId || !metodoPago) {
        return res.status(400).json({ error: 'citaId y metodoPago son obligatorios.' });
      }

      const cita = await prisma.cita.findUnique({
        where: { id: Number(citaId) },
        include: { paciente: true, medico: true, especialidad: true },
      });

      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada.' });
      }

      if (cita.estadoPago === 'Pagado') {
        return res.status(400).json({ error: 'La cita ya fue pagada.' });
      }

      const transaccionId = `TRX-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;

      const citaActualizada = await prisma.cita.update({
        where: { id: cita.id },
        data: {
          estadoPago: 'Pagado',
          metodoPago,
          transaccionId,
          estado: 'confirmada',
        },
        include: { paciente: true, medico: true, especialidad: true },
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      return res.json({
        success: true,
        message: 'Pago procesado exitosamente (simulado)',
        comprobante: {
          transaccionId,
          citaId: citaActualizada.id,
          paciente: `${citaActualizada.paciente.nombres} ${citaActualizada.paciente.apellidos}`,
          medico: citaActualizada.medico.nombre,
          especialidad: citaActualizada.especialidad.nombre,
          fecha: citaActualizada.fecha.toISOString().split('T')[0],
          hora: citaActualizada.hora,
          monto: '80.00',
          metodoPago: citaActualizada.metodoPago,
          estadoPago: citaActualizada.estadoPago,
        },
      });
    } catch (e) {
      next(e);
    }
  },
};
