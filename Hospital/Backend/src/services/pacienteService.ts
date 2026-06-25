import { prisma } from '../config/database';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

export const pacienteService = {
  async getAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.paciente.findMany({ skip, take: limit }),
      prisma.paciente.count()
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  },
  async getById(id: number) {
    return prisma.paciente.findUnique({
      where: { id },
      include: { citas: { include: { medico: true, especialidad: true } } }
    });
  },
  async create(data: Prisma.PacienteCreateInput) {
    if (!data.password) {
      throw new Error("La contraseña es obligatoria.");
    }
    const hash = bcrypt.hashSync(data.password, 10);
    return prisma.paciente.create({ data: { ...data, password: hash } });
  }
};
