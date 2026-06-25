import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';
import { sendEmail, emailTemplates } from '../utils/mailer';

export const citaService = {
  async getAll(filtros: Prisma.CitaWhereInput, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.cita.findMany({
        where: filtros,
        include: { paciente: true, medico: true, especialidad: true },
        skip,
        take: limit
      }),
      prisma.cita.count({ where: filtros })
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  },
  async getTodayByMedico(medicoId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return prisma.cita.findMany({
      where: {
        medicoId,
        fecha: {
          gte: today,
          lt: tomorrow
        }
      },
      include: { paciente: true, especialidad: true },
      orderBy: { hora: 'asc' }
    });
  },
  async create(data: Prisma.CitaUncheckedCreateInput) {
    const permitidos: Prisma.CitaUncheckedCreateInput = {
      pacienteId: Number(data.pacienteId),
      medicoId: Number(data.medicoId),
      especialidadId: Number(data.especialidadId),
      fecha: new Date(data.fecha as any),
      hora: data.hora
    };
    
    const cita = await prisma.cita.create({ 
      data: permitidos,
      include: { paciente: true, especialidad: true }
    });

    if (cita.paciente?.correo) {
      // Disparar correo asíncronamente sin bloquear la respuesta (RF-15)
      sendEmail(
        cita.paciente.correo,
        'Confirmación de Cita Médica',
        emailTemplates.citaConfirmacion,
        {
          nombre: cita.paciente.nombres,
          especialidad: cita.especialidad.nombre,
          fecha: cita.fecha.toISOString().split('T')[0],
          hora: cita.hora
        }
      ).catch(err => console.error("Error enviando correo de confirmación:", err));
    }

    return cita;
  },
  async update(id: number, data: Prisma.CitaUncheckedUpdateInput) {
    if (data.fecha) data.fecha = new Date(data.fecha as any);
    return prisma.cita.update({ where: { id }, data });
  },
  async delete(id: number) {
    return prisma.cita.delete({ where: { id } });
  }
};
