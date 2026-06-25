import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { sendEmail, emailTemplates } from '../utils/mailer';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'dev-refresh-secret';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@hospital.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

function signToken(payload: { id: number; role: string; nombre: string }) {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' } as any);
  return { token, refreshToken };
}

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        return res.status(400).json({ error: 'Credenciales incompletas' });
      }

      if (identifier === ADMIN_EMAIL && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
        const { token, refreshToken } = signToken({ id: 0, role: 'ADMIN', nombre: 'Administrador Principal' });
        return res.json({ token, refreshToken, id: 0, role: 'ADMIN', nombre: 'Administrador Principal' });
      }

      const paciente = await prisma.paciente.findFirst({
        where: { OR: [{ dni: identifier }, { correo: identifier }] }
      });

      if (paciente) {
        if (!bcrypt.compareSync(password, paciente.password)) {
          return res.status(401).json({ error: 'Contraseña incorrecta' });
        }
        const nombre = `${paciente.nombres} ${paciente.apellidos}`;
        const { token, refreshToken } = signToken({ id: paciente.id, role: 'PACIENTE', nombre });
        return res.json({ token, refreshToken, id: paciente.id, role: 'PACIENTE', nombre });
      }

      const medico = await prisma.medico.findFirst({
        where: { colegiatura: identifier }
      });

      if (medico) {
        if (!bcrypt.compareSync(password, medico.password)) {
          return res.status(401).json({ error: 'Contraseña incorrecta' });
        }
        const { token, refreshToken } = signToken({ id: medico.id, role: 'MEDICO', nombre: medico.nombre });
        return res.json({ token, refreshToken, id: medico.id, role: 'MEDICO', nombre: medico.nombre });
      }

      return res.status(404).json({ error: 'Usuario no encontrado en el sistema' });

    } catch (e) {
      next(e);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(401).json({ error: 'Refresh token requerido' });
      
      jwt.verify(refreshToken, REFRESH_SECRET, (err: any, decoded: any) => {
        if (err) return res.status(403).json({ error: 'Refresh token inválido o expirado' });
        const { id, role, nombre } = decoded;
        const tokens = signToken({ id, role, nombre });
        return res.json(tokens);
      });
    } catch (e) { next(e); }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'Correo requerido' });

      const paciente = await prisma.paciente.findUnique({ where: { correo: email } });
      if (!paciente) {
        // Return 200 even if not found to prevent email enumeration
        return res.json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación.' });
      }

      const resetToken = jwt.sign({ id: paciente.id, role: 'PACIENTE' }, JWT_SECRET, { expiresIn: '15m' });
      // Asume que el frontend corre en puerto 5173
      const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

      await sendEmail(
        paciente.correo,
        'Recuperación de Contraseña',
        emailTemplates.resetPassword,
        { nombre: paciente.nombres, resetUrl }
      );

      return res.json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación.' });
    } catch (e) { next(e); }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) return res.status(400).json({ error: 'Faltan datos' });

      let decoded: any;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (err) {
        return res.status(400).json({ error: 'Token inválido o expirado' });
      }

      if (decoded.role === 'PACIENTE') {
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await prisma.paciente.update({
          where: { id: decoded.id },
          data: { password: hashedPassword }
        });
        return res.json({ message: 'Contraseña actualizada correctamente' });
      }

      return res.status(400).json({ error: 'Rol no soportado para recuperación' });
    } catch (e) { next(e); }
  }
};
