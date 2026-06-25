import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';

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
  async create(data: Prisma.CitaUncheckedCreateInput) {
    const permitidos: Prisma.CitaUncheckedCreateInput = {
      pacienteId: Number(data.pacienteId),
      medicoId: Number(data.medicoId),
      especialidadId: Number(data.especialidadId),
      fecha: new Date(data.fecha as any),
      hora: data.hora
    };
    return prisma.cita.create({ data: permitidos });
  },
  async update(id: number, data: Prisma.CitaUncheckedUpdateInput) {
    if (data.fecha) data.fecha = new Date(data.fecha as any);
    return prisma.cita.update({ where: { id }, data });
  },
  async delete(id: number) {
    return prisma.cita.delete({ where: { id } });
  }
};
