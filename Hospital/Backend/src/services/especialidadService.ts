import { prisma } from '../config/database';

export const especialidadService = {
  async getAll() {
    return prisma.especialidad.findMany();
  }
};
