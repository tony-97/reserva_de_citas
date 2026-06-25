import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import type { AuthRequest } from '../middlewares/auth';

export const adminController = {
  async listMedicos(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        prisma.medico.findMany({
          include: { especialidad: true },
          orderBy: { nombre: 'asc' },
          skip,
          take: limit
        }),
        prisma.medico.count()
      ]);
      return res.json({ data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
    } catch (e) { next(e); }
  },

  async createMedico(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { nombre, colegiatura, password, especialidadId, estado } = req.body;
      if (!nombre || !colegiatura || !especialidadId || !password) {
        return res.status(400).json({ error: 'Nombre, colegiatura, especialidad y contraseña son obligatorios.' });
      }
      const hash = bcrypt.hashSync(password, 10);
      const medico = await prisma.medico.create({
        data: { nombre, colegiatura, password: hash, especialidadId: Number(especialidadId), estado: estado || 'Activo' }
      });
      return res.status(201).json(medico);
    } catch (e) { next(e); }
  },

  async updateMedico(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { nombre, colegiatura, password, especialidadId, estado } = req.body;
      const data: any = {};
      if (nombre) data.nombre = nombre;
      if (colegiatura) data.colegiatura = colegiatura;
      if (password) data.password = bcrypt.hashSync(password, 10);
      if (especialidadId) data.especialidadId = Number(especialidadId);
      if (estado) data.estado = estado;
      const medico = await prisma.medico.update({ where: { id }, data });
      return res.json(medico);
    } catch (e) { next(e); }
  },

  async deleteMedico(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await prisma.cita.deleteMany({ where: { medicoId: id } });
      await prisma.medico.delete({ where: { id } });
      return res.json({ message: 'Médico eliminado correctamente.' });
    } catch (e) { next(e); }
  },

  async listPacientes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        prisma.paciente.findMany({ 
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.paciente.count()
      ]);
      return res.json({ data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
    } catch (e) { next(e); }
  },

  async createPaciente(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { nombres, apellidos, dni, telefono, correo, password } = req.body;
      if (!nombres || !apellidos || !dni || !telefono || !correo || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios, incluyendo la contraseña.' });
      }
      const hash = bcrypt.hashSync(password, 10);
      const paciente = await prisma.paciente.create({
        data: { nombres, apellidos, dni, telefono, correo, password: hash }
      });
      return res.status(201).json(paciente);
    } catch (e) { next(e); }
  },

  async updatePaciente(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { nombres, apellidos, dni, telefono, correo, password } = req.body;
      const data: any = {};
      if (nombres) data.nombres = nombres;
      if (apellidos) data.apellidos = apellidos;
      if (dni) data.dni = dni;
      if (telefono) data.telefono = telefono;
      if (correo) data.correo = correo;
      if (password) data.password = bcrypt.hashSync(password, 10);
      const paciente = await prisma.paciente.update({ where: { id }, data });
      return res.json(paciente);
    } catch (e) { next(e); }
  },

  async deletePaciente(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await prisma.cita.deleteMany({ where: { pacienteId: id } });
      await prisma.paciente.delete({ where: { id } });
      return res.json({ message: 'Paciente eliminado correctamente.' });
    } catch (e) { next(e); }
  },

  async listEspecialidades(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const especialidades = await prisma.especialidad.findMany({ orderBy: { nombre: 'asc' } });
      return res.json(especialidades);
    } catch (e) { next(e); }
  },

  async createEspecialidad(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { nombre } = req.body;
      if (!nombre) return res.status(400).json({ error: 'Nombre de especialidad es obligatorio.' });
      const especialidad = await prisma.especialidad.create({ data: { nombre } });
      return res.status(201).json(especialidad);
    } catch (e) { next(e); }
  },

  async deleteEspecialidad(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await prisma.cita.deleteMany({ where: { especialidadId: id } });
      await prisma.medico.deleteMany({ where: { especialidadId: id } });
      await prisma.especialidad.delete({ where: { id } });
      return res.json({ message: 'Especialidad eliminada correctamente.' });
    } catch (e) { next(e); }
  }
};
