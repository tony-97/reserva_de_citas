import { prisma } from '../config/database';

export const medicoService = {
  async getAll(especialidadId?: number, page: number = 1, limit: number = 10) {
    const where = especialidadId ? { especialidadId } : {};
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.medico.findMany({ where, include: { especialidad: true }, skip, take: limit }),
      prisma.medico.count({ where })
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
};
